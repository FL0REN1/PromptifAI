using Microsoft.EntityFrameworkCore;
using promtifAI__backend.Models.UserModel;
using System.Collections.Concurrent;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using static System.Console;

namespace promtifAI__backend
{
    public class Program
    {
        private static ConcurrentDictionary<WebSocket, string> connectedClients = new ConcurrentDictionary<WebSocket, string>();
        private static ConcurrentDictionary<string, List<WebSocket>> rooms = new ConcurrentDictionary<string, List<WebSocket>>();
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("DbConn");
            var userId = builder.Configuration.GetValue<string>("DbConn:UserId");
            var password = builder.Configuration.GetValue<string>("DbConn:Password");

            connectionString = connectionString?.Replace("${DbConn:UserId}", userId)
                                                 .Replace("${DbConn:Password}", password);

            builder.Services.AddDbContext<UserContext>(options => options.UseSqlServer(connectionString));
            builder.Services.AddScoped<IUserRep, UserRep>();

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCors();

            builder.Services.AddAutoMapper(typeof(Program).Assembly);

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors(builder =>
            {
                builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
            });

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}