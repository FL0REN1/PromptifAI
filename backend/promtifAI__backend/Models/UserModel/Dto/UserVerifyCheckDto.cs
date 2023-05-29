using System.ComponentModel.DataAnnotations;

namespace promtifAI__backend.Models.UserModel.Dto
{
    public class UserVerifyCheckDto
    {
        [Required]
        public string? PhoneNumber { get; set; }
        [Required]
        public string? Login { get; set; }
    }
}
