using System.ComponentModel.DataAnnotations;

namespace promtifAI__backend.Models.UserModel.Dto
{
    public class UserPasswordDto
    {
        [Required]
        public string? Password { get; set; }
    }
}
