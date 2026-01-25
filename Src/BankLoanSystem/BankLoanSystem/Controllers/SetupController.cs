using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BankLoanSystem.Data;
using BankLoanSystem.Models;
using System.Security.Cryptography;
using System.Text;

namespace BankLoanSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SetupController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SetupController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("initialize-database")]
        public async Task<IActionResult> InitializeDatabase()
        {
            try
            {
                await _context.Database.MigrateAsync();

                if (!await _context.SystemUsers.AnyAsync())
                {
                    var adminUser = new SystemUser
                    {
                        Username = "admin",
                        PasswordHash = HashPassword("admin123"),
                        FullName = "Администратор Системы",
                        Role = "Admin",
                        Email = "admin@bank.ru",
                        CreatedDate = DateTime.Now,
                        IsActive = true
                    };

                    var managerUser = new SystemUser
                    {
                        Username = "manager",
                        PasswordHash = HashPassword("manager123"),
                        FullName = "Менеджер Иванов",
                        Role = "Manager",
                        Email = "manager@bank.ru",
                        CreatedDate = DateTime.Now,
                        IsActive = true
                    };

                    var clientUser = new SystemUser
                    {
                        Username = "client1",
                        PasswordHash = HashPassword("client123"),
                        FullName = "Клиент Петров",
                        Role = "Client",
                        Email = "client@bank.ru",
                        CreatedDate = DateTime.Now,
                        IsActive = true
                    };

                    _context.SystemUsers.AddRange(adminUser, managerUser, clientUser);
                    await _context.SaveChangesAsync();

                    var client = new Client
                    {
                        FirstName = "Алексей",
                        LastName = "Смирнов",
                        MiddleName = "Петрович",
                        PhoneNumber = "+79161234567",
                        Email = "alexey@mail.ru",
                        Address = "Москва, ул. Ленина, д. 10",
                        RegistrationDate = DateTime.Now,
                        CreditRating = 5,
                        IsActive = true
                    };

                    _context.Clients.Add(client);
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        Success = true,
                        Message = "База данных инициализирована",
                        UsersCreated = 3,
                        TestLogin = "admin / admin123"
                    });
                }

                return Ok(new
                {
                    Success = true,
                    Message = "База данных уже инициализирована",
                    UserCount = await _context.SystemUsers.CountAsync()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "Ошибка инициализации",
                    Error = ex.Message
                });
            }
        }

        [HttpGet("check-users")]
        public async Task<IActionResult> CheckUsers()
        {
            var users = await _context.SystemUsers
                .Select(u => new
                {
                    u.Username,
                    u.FullName,
                    u.Role,
                    u.IsActive,
                    PasswordHashLength = u.PasswordHash.Length
                })
                .ToListAsync();

            return Ok(new { Users = users });
        }

        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateUserRequest request)
        {
            if (request.Username != "admin")
            {
                return BadRequest("Можно создать только пользователя admin");
            }

            var existingUser = await _context.SystemUsers
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (existingUser != null)
            {
                return BadRequest("Пользователь уже существует");
            }

            var adminUser = new SystemUser
            {
                Username = request.Username,
                PasswordHash = HashPassword(request.Password),
                FullName = "Администратор Системы",
                Role = "Admin",
                Email = "admin@bank.ru",
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.SystemUsers.Add(adminUser);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Success = true,
                Message = "Администратор создан",
                Username = request.Username
            });
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }

    public class CreateUserRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
