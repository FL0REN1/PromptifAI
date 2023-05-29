using System.ComponentModel.DataAnnotations;

namespace promtifAI__backend.Models.UserModel.Dto
{
    public class UserLoginCheckDto
    {
        [Required]
        public string? Login { get; set; }
    }
}
