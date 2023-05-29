using System.ComponentModel.DataAnnotations;

namespace promtifAI__backend.Models.UserModel.Dto
{
    public class UserMsgRoomIsOnOffDto
    {
        [Required]
        public bool ChatRoomIsOn { get; set; }
    }
}
