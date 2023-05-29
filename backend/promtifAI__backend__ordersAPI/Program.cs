using Microsoft.EntityFrameworkCore;
using promtifAI__backend__ordersAPI.Models.OrderModel;

namespace promtifAI__backend__ordersAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("DbConn");
            var orderId = builder.Configuration.GetValue<string>("DbConn:OrderId");
            var password = builder.Configuration.GetValue<string>("DbConn:Password");

            connectionString = connectionString?.Replace("${DbConn:UserId}", orderId)
                                                 .Replace("${DbConn:Password}", password);

            builder.Services.AddDbContext<OrderContext>(options => options.UseSqlServer(connectionString));
            builder.Services.AddScoped<IOrderRep, OrderRep>();

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