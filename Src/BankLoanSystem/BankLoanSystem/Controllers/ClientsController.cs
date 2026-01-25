using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BankLoanSystem.Data;
using BankLoanSystem.Models;

namespace BankLoanSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            return await _context.Clients
                .Where(c => c.IsActive)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);

            if (client == null)
                return NotFound();

            return client;
        }

        [HttpPost]
        public async Task<ActionResult<Client>> PostClient(Client client)
        {
            client.RegistrationDate = DateTime.Now;
            client.IsActive = true;

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClient", new { id = client.ClientId }, client);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutClient(int id, Client client)
        {
            if (id != client.ClientId)
                return BadRequest();

            _context.Entry(client).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
                return NotFound();

            client.IsActive = false;
            _context.Entry(client).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetStatistics()
        {
            var totalClients = await _context.Clients.CountAsync(c => c.IsActive);
            var activeLoans = await _context.Loans.CountAsync(l => l.Status == "Активный");
            var activeDeposits = await _context.Deposits.CountAsync(d => d.Status == "Активный");

            var totalBalance = await _context.Accounts
                .Where(a => a.IsActive)
                .SumAsync(a => (decimal?)a.Balance) ?? 0;

            return new
            {
                TotalClients = totalClients,
                ActiveLoans = activeLoans,
                ActiveDeposits = activeDeposits,
                TotalBalance = totalBalance
            };
        }

        [HttpGet("{id}/accounts")]
        public async Task<ActionResult<IEnumerable<Account>>> GetClientAccounts(int id)
        {
            return await _context.Accounts
                .Where(a => a.ClientId == id && a.IsActive)
                .ToListAsync();
        }

        [HttpGet("{id}/loans")]
        public async Task<ActionResult<IEnumerable<Loan>>> GetClientLoans(int id)
        {
            return await _context.Loans
                .Where(l => l.ClientId == id)
                .ToListAsync();
        }

        private bool ClientExists(int id)
        {
            return _context.Clients.Any(e => e.ClientId == id);
        }
    }
}
