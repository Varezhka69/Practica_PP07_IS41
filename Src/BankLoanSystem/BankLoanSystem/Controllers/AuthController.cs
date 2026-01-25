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
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin login)
        {
            if (login.Username == "admin" && login.Password == "admin123")
            {
                return Ok(new
                {
                    UserId = 1,
                    Username = "admin",
                    FullName = "Администратор Системы",
                    Role = "Admin",
                    Email = "admin@bank.ru",
                    IsActive = true
                });
            }

            if (login.Username == "manager1" && login.Password == "admin123")
            {
                return Ok(new
                {
                    UserId = 2,
                    Username = "manager1",
                    FullName = "Иванов Иван Иванович",
                    Role = "Manager",
                    Email = "manager@bank.ru",
                    IsActive = true
                });
            }

            if (login.Username == "operator1" && login.Password == "admin123")
            {
                return Ok(new
                {
                    UserId = 3,
                    Username = "operator1",
                    FullName = "Петрова Мария Сергеевна",
                    Role = "Operator",
                    Email = "operator@bank.ru",
                    IsActive = true
                });
            }

            if (login.Username == "client1" && login.Password == "admin123")
            {
                return Ok(new
                {
                    UserId = 4,
                    Username = "client1",
                    FullName = "Клиент Сбербанка",
                    Role = "Client",
                    Email = "client@bank.ru",
                    IsActive = true
                });
            }

            return Unauthorized("Неверный логин или пароль");
        }

        [HttpPost("simple-login")]
        public async Task<IActionResult> SimpleLogin([FromBody] UserLogin login)
        {
            var user = await _context.SystemUsers
                .FirstOrDefaultAsync(u => u.Username == login.Username && u.IsActive);

            if (user == null)
                return Unauthorized("Пользователь не найден");
            if (login.Password == "admin123" && login.Username == "admin")
            {
                return Ok(new
                {
                    UserId = 1,
                    Username = "admin",
                    FullName = "Администратор Системы",
                    Role = "Admin",
                    Email = "admin@bank.ru",
                    IsActive = true
                });
            }

            return Unauthorized("Неверный логин или пароль");
        }

        [HttpPost("test-login")]
        public IActionResult TestLogin()
        {
            return Ok(new
            {
                UserId = 1,
                Username = "admin",
                FullName = "Администратор Системы",
                Role = "Admin",
                Email = "admin@bank.ru",
                IsActive = true
            });
        }
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var hash = HashPassword(password);
            return hash == storedHash;
        }
    }
}
