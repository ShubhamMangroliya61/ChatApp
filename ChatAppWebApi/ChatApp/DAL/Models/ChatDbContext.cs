using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ChatAppWebApi.DAL.Models;

public partial class ChatDbContext : DbContext
{
    public ChatDbContext()
    {
    }

    public ChatDbContext(DbContextOptions<ChatDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Chat> Chats { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Database=ChatApp;Username=postgres;Password=Shubham61");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Chat>(entity =>
        {
            entity.HasKey(e => e.Chatid).HasName("chats_pkey");

            entity.Property(e => e.Createddate).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.Fromuser).WithMany(p => p.ChatFromusers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("chats_fromuserid_fkey");

            entity.HasOne(d => d.Touser).WithMany(p => p.ChatTousers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("chats_touserid_fkey");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.Messageid).HasName("messages_pkey");

            entity.Property(e => e.Createddate).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.Chat).WithMany(p => p.Messages)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("messages_chatid_fkey");

            entity.HasOne(d => d.Fromuser).WithMany(p => p.MessageFromusers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("messages_fromuserid_fkey");

            entity.HasOne(d => d.Touser).WithMany(p => p.MessageTousers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("messages_touserid_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Userid).HasName("User_pkey");

            entity.Property(e => e.Createddate).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
