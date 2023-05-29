using System.ComponentModel.DataAnnotations;

namespace promtifAI__backend__ordersAPI.Models.OrderModel.Dto
{
    public class OrderCreateDto
    {
        [Required]
        public int OrderId { get; set; }
        [Required]
        public string? Type { get; set; }
        [Required]
        public string? Date { get; set; }
    }
}
