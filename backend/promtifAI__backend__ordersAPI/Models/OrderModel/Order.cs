using System.ComponentModel.DataAnnotations;

namespace promtifAI__backend__ordersAPI.Models.OrderModel
{
    public class Order
    {
        [Key]
        [Required]
        public int Id { get; set; }
        [Required] 
        public int OrderId { get; set;  }
        [Required]
        public string? Type { get; set; }
        [Required]
        public string? Date { get; set; }
    }
}
