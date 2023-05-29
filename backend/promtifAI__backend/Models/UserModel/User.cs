using System.ComponentModel.DataAnnotations;

namespace promtifAI__backend.Models.UserModel
{
    public class User
    {
        [Key]
        [Required]
        public int Id { get; set; }
        [Required]
        public string? FirstName { get; set; }
        [Required]
        public string? SecondName { get; set; }
        [Required]
        public string? Login { get; set; }
        [Required]
        public string? Password { get; set; }
        [Required]
        public string? PhoneNumber { get; set; }
        [Required]
        public string? Description { get; set; }
        [Required]
        public string? Review { get; set; }
        [Required]
        public int ReviewStars { get; set; }
        [Required]
        public int Money { get; set; }
        [Required]
        public bool IsMailVerify { get; set; }
        [Required]
        public bool IsPhoneVerify { get; set; }
        [Required]
        public string? ChatBotMessage { get; set; }
        [Required]
        public bool ChatRoomIsOn { get; set; }
        [Required]
        public string? ChatTopic { get; set; }
        [Required]
        public bool ChatClosedAppeal { get; set; }
    }
}
