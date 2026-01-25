using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BankLoanSystem.Models
{
    [Table("Deposits")]
    public class Deposit
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DepositId { get; set; }

        [Required]
        public int ClientId { get; set; }

        [Required]
        [StringLength(20)]
        public string DepositNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string DepositType { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal InitialAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal CurrentAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal InterestRate { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? TermMonths { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Активный";

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
