using Microsoft.EntityFrameworkCore;
using BankLoanSystem.Models;

namespace BankLoanSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<SystemUser> SystemUsers { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<Deposit> Deposits { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<SystemUser>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Client>()
                .HasIndex(c => c.PhoneNumber)
                .IsUnique()
                .HasFilter("[PhoneNumber] IS NOT NULL");

            modelBuilder.Entity<Client>()
                .HasIndex(c => c.Email)
                .IsUnique()
                .HasFilter("[Email] IS NOT NULL");

            modelBuilder.Entity<Account>()
                .HasIndex(a => a.AccountNumber)
                .IsUnique();

            modelBuilder.Entity<Loan>()
                .HasIndex(l => l.LoanNumber)
                .IsUnique();

            modelBuilder.Entity<Loan>()
                .Property(l => l.Status)
                .HasDefaultValue("Активный");

            modelBuilder.Entity<Deposit>()
                .HasIndex(d => d.DepositNumber)
                .IsUnique();

            modelBuilder.Entity<Deposit>()
                .Property(d => d.Status)
                .HasDefaultValue("Активный");

            modelBuilder.Entity<Account>()
                .HasOne(a => a.Client)
                .WithMany(c => c.Accounts)
                .HasForeignKey(a => a.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Loan>()
                .HasOne(l => l.Client)
                .WithMany(c => c.Loans)
                .HasForeignKey(l => l.ClientId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
