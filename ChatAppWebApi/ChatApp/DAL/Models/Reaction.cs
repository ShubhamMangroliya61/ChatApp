using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ChatAppWebApi.DAL.Models;

[Table("reactions")]
public partial class Reaction
{
    [Key]
    [Column("reactionid")]
    public long Reactionid { get; set; }

    [Column("reaction")]
    public string Reaction1 { get; set; } = null!;

    [InverseProperty("Reaction")]
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
