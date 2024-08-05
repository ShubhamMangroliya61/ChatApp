using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ChatAppWebApi.DAL.Models;

[Table("chats")]
public partial class Chat
{
    [Key]
    [Column("chatid")]
    public long Chatid { get; set; }

    [Column("fromuserid")]
    public long Fromuserid { get; set; }

    [Column("touserid")]
    public long Touserid { get; set; }

    [Column("isdeleted")]
    public bool Isdeleted { get; set; }

    [Column("createddate", TypeName = "timestamp without time zone")]
    public DateTime? Createddate { get; set; }

    [Column("modifieddate", TypeName = "timestamp without time zone")]
    public DateTime? Modifieddate { get; set; }

    [ForeignKey("Fromuserid")]
    [InverseProperty("ChatFromusers")]
    public virtual User Fromuser { get; set; } = null!;

    [InverseProperty("Chat")]
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    [ForeignKey("Touserid")]
    [InverseProperty("ChatTousers")]
    public virtual User Touser { get; set; } = null!;
}
