using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ChatAppWebApi.DAL.Models;

[Table("User")]
public partial class User
{
    [Key]
    [Column("userid")]
    public long Userid { get; set; }

    [Column("username")]
    [StringLength(50)]
    public string Username { get; set; } = null!;

    [Column("email")]
    [StringLength(100)]
    public string Email { get; set; } = null!;

    [Column("password")]
    [StringLength(255)]
    public string Password { get; set; } = null!;

    [Column("contactnumber")]
    [StringLength(15)]
    public string? Contactnumber { get; set; }

    [Column("profilepictureurl")]
    public string? Profilepictureurl { get; set; }

    [Column("profilepicturename")]
    [StringLength(100)]
    public string? Profilepicturename { get; set; }

    [Column("name")]
    [StringLength(50)]
    public string? Name { get; set; }

    [Column("isdeleted")]
    public bool Isdeleted { get; set; }

    [Column("createddate", TypeName = "timestamp without time zone")]
    public DateTime Createddate { get; set; }

    [Column("modifieddate", TypeName = "timestamp without time zone")]
    public DateTime? Modifieddate { get; set; }

    [InverseProperty("Fromuser")]
    public virtual ICollection<Chat> ChatFromusers { get; set; } = new List<Chat>();

    [InverseProperty("Touser")]
    public virtual ICollection<Chat> ChatTousers { get; set; } = new List<Chat>();

    [InverseProperty("Fromuser")]
    public virtual ICollection<Message> MessageFromusers { get; set; } = new List<Message>();

    [InverseProperty("Touser")]
    public virtual ICollection<Message> MessageTousers { get; set; } = new List<Message>();
}
