namespace BankLoansApp.Models;

public class Deposit
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string DepositType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal InterestRate { get; set; }
    public DateTime OpenDate { get; set; }
    public DateTime? CloseDate { get; set; }
    public string Status { get; set; } = "Active";
    public decimal CurrentBalance { get; set; }
}
