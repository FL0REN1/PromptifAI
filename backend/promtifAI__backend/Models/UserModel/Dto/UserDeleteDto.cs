using System.ComponentModel.DataAnnotations;

namespace promtifAI__backend.Models.UserModel.Dto
{
    public class UserDeleteDto
    {
        [Required]
        public int Id { get; set; }
    }
}
