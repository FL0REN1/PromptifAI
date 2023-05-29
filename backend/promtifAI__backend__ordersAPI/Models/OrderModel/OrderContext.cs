using Microsoft.EntityFrameworkCore;

namespace promtifAI__backend__ordersAPI.Models.OrderModel
{
    public class OrderContext : DbContext
    {
        public OrderContext(DbContextOptions<OrderContext> options) : base(options) { }
        public DbSet<Order> Orders { get; set; }
    }
}
