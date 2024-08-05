using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ChatAppWebApi.DAL.Models;

[Table("messages")]
public partial class Message
{
    [Key]
    [Column("messageid")]
    public long Messageid { get; set; }

    [Column("chatid")]
    public long Chatid { get; set; }

    [Column("fromuserid")]
    public long Fromuserid { get; set; }

    [Column("touserid")]
    public long Touserid { get; set; }

    [Column("messagetext")]
    public string Messagetext { get; set; } = null!;

    [Column("isseen")]
    public bool Isseen { get; set; }

    [Column("isdelivered")]
    public bool Isdelivered { get; set; }

    [Column("isdeleted")]
    public bool Isdeleted { get; set; }

    [Column("createddate", TypeName = "timestamp without time zone")]
    public DateTime? Createddate { get; set; }

    [Column("modifieddate", TypeName = "timestamp without time zone")]
    public DateTime? Modifieddate { get; set; }

    [ForeignKey("Chatid")]
    [InverseProperty("Messages")]
    public virtual Chat Chat { get; set; } = null!;

    [ForeignKey("Fromuserid")]
    [InverseProperty("MessageFromusers")]
    public virtual User Fromuser { get; set; } = null!;

    [ForeignKey("Touserid")]
    [InverseProperty("MessageTousers")]
    public virtual User Touser { get; set; } = null!;
}
