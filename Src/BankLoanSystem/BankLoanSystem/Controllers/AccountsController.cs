using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BankLoanSystem.Data;
using BankLoanSystem.Models;

namespace BankLoanSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Account>>> GetAccounts()
        {
            return await _context.Accounts
                .Where(a => a.IsActive)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Account>> GetAccount(int id)
        {
            var account = await _context.Accounts.FindAsync(id);

            if (account == null)
                return NotFound();

            return account;
        }

        [HttpGet("by-client/{clientId}")]
        public async Task<ActionResult<IEnumerable<Account>>> GetAccountsByClient(int clientId)
        {
            return await _context.Accounts
                .Where(a => a.ClientId == clientId && a.IsActive)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Account>> PostAccount(Account account)
        {
            account.AccountNumber = GenerateAccountNumber();
            account.OpeningDate = DateTime.Now;
            account.IsActive = true;

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAccount", new { id = account.AccountId }, account);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccount(int id, Account account)
        {
            if (id != account.AccountId)
                return BadRequest();

            _context.Entry(account).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }
        [HttpPost("transfer")]
        public async Task<IActionResult> Transfer([FromBody] TransferRequest request)
        {
            var fromAccount = await _context.Accounts.FindAsync(request.FromAccountId);
            var toAccount = await _context.Accounts.FindAsync(request.ToAccountId);

            if (fromAccount == null || toAccount == null)
                return BadRequest("Счет не найден");

            if (fromAccount.Balance < request.Amount)
                return BadRequest("Недостаточно средств");

            fromAccount.Balance -= request.Amount;

            toAccount.Balance += request.Amount;

            var transactionFrom = new Transaction
            {
                AccountId = request.FromAccountId,
                TransactionType = "Перевод",
                Amount = -request.Amount,
                Description = $"Перевод на счет {toAccount.AccountNumber}",
                TransactionDate = DateTime.Now,
                CreatedByUserId = request.UserId
            };

            var transactionTo = new Transaction
            {
                AccountId = request.ToAccountId,
                TransactionType = "Перевод",
                Amount = request.Amount,
                Description = $"Перевод со счета {fromAccount.AccountNumber}",
                TransactionDate = DateTime.Now,
                CreatedByUserId = request.UserId
            };

            _context.Transactions.Add(transactionFrom);
            _context.Transactions.Add(transactionTo);

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Перевод выполнен успешно" });
        }

        private string GenerateAccountNumber()
        {
            var random = new Random();
            return $"40702810{random.Next(100000, 999999)}";
        }

        private bool AccountExists(int id)
        {
            return _context.Accounts.Any(e => e.AccountId == id);
        }
    }

    public class TransferRequest
    {
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public decimal Amount { get; set; }
        public int UserId { get; set; }
    }
}
