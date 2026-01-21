namespace BankLoansApp.Models;

public class Deposit
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string DepositType { get; set; } = string.Empty; // Сберегательный, Накопительный
    public decimal Amount { get; set; }
    public decimal InterestRate { get; set; }
    public DateTime OpenDate { get; set; }
    public DateTime? CloseDate { get; set; }
    public string Status { get; set; } = "Active"; // Active, Closed
    public decimal CurrentBalance { get; set; }
}
