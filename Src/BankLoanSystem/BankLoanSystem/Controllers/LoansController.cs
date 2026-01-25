using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BankLoanSystem.Data;
using BankLoanSystem.Models;

namespace BankLoanSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoansController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LoansController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Loan>>> GetLoans()
        {
            return await _context.Loans.ToListAsync();
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Loan>>> GetActiveLoans()
        {
            return await _context.Loans
                .Where(l => l.Status == "Активный")
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Loan>> GetLoan(int id)
        {
            var loan = await _context.Loans.FindAsync(id);

            if (loan == null)
                return NotFound();

            return loan;
        }

        [HttpGet("by-client/{clientId}")]
        public async Task<ActionResult<IEnumerable<Loan>>> GetLoansByClient(int clientId)
        {
            return await _context.Loans
                .Where(l => l.ClientId == clientId)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Loan>> PostLoan(Loan loan)
        {
            loan.LoanNumber = GenerateLoanNumber();

            loan.MonthlyPayment = CalculateMonthlyPayment(loan.LoanAmount, loan.InterestRate, loan.TermMonths);
            loan.RemainingAmount = loan.LoanAmount;
            loan.StartDate = DateTime.Now;
            loan.EndDate = DateTime.Now.AddMonths(loan.TermMonths);

            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLoan", new { id = loan.LoanId }, loan);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoan(int id, Loan loan)
        {
            if (id != loan.LoanId)
                return BadRequest();

            _context.Entry(loan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoanExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }
        [HttpPost("{id}/make-payment")]
        public async Task<IActionResult> MakePayment(int id, [FromBody] PaymentRequest request)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null)
                return NotFound();

            if (loan.RemainingAmount <= 0)
                return BadRequest("Кредит уже погашен");

            var paymentAmount = Math.Min(request.Amount, loan.RemainingAmount ?? 0);
            loan.RemainingAmount -= paymentAmount;

            if (loan.RemainingAmount <= 0)
            {
                loan.Status = "Закрыт";
            }

            var transaction = new Transaction
            {
                AccountId = request.AccountId,
                TransactionType = "Платеж по кредиту",
                Amount = -paymentAmount,
                Description = $"Платеж по кредиту №{loan.LoanNumber}",
                TransactionDate = DateTime.Now,
                RelatedLoanId = loan.LoanId,
                CreatedByUserId = request.UserId
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Платеж принят",
                RemainingAmount = loan.RemainingAmount
            });
        }

        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetLoanStatistics()
        {
            var totalLoans = await _context.Loans.CountAsync();
            var activeLoans = await _context.Loans.CountAsync(l => l.Status == "Активный");

            // Используем безопасное суммирование для nullable полей
            var totalLoanAmount = await _context.Loans
                .SumAsync(l => (decimal?)l.LoanAmount) ?? 0;

            var totalRemaining = await _context.Loans
                .SumAsync(l => (decimal?)l.RemainingAmount) ?? 0;

            return new
            {
                TotalLoans = totalLoans,
                ActiveLoans = activeLoans,
                TotalLoanAmount = totalLoanAmount,
                TotalRemaining = totalRemaining,
                PaidAmount = totalLoanAmount - totalRemaining
            };
        }

        private string GenerateLoanNumber()
        {
            var random = new Random();
            return $"LN{DateTime.Now:yyyyMMdd}{random.Next(1000, 9999)}";
        }

        private decimal CalculateMonthlyPayment(decimal principal, decimal annualRate, int months)
        {
            if (months == 0 || annualRate == 0)
                return principal / 1;

            decimal monthlyRate = annualRate / 100 / 12;

            if (monthlyRate <= 0)
                return principal / months;

            double rate = (double)monthlyRate;
            double monthsDouble = months;
            double principalDouble = (double)principal;

            double coefficient = (rate * Math.Pow(1 + rate, monthsDouble)) / (Math.Pow(1 + rate, monthsDouble) - 1);
            double monthlyPayment = principalDouble * coefficient;

            return (decimal)monthlyPayment;
        }

        private bool LoanExists(int id)
        {
            return _context.Loans.Any(e => e.LoanId == id);
        }
    }

    public class PaymentRequest
    {
        public decimal Amount { get; set; }
        public int AccountId { get; set; }
        public int UserId { get; set; }
    }
}
