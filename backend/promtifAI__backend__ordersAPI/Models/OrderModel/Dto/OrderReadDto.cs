using System.ComponentModel.DataAnnotations;

namespace promtifAI__backend__ordersAPI.Models.OrderModel.Dto
{
    public class OrderReadDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int OrderId { get; set; }
        [Required]
        public string? Type { get; set; }
        [Required]
        public string? Date { get; set; }
    }
}
