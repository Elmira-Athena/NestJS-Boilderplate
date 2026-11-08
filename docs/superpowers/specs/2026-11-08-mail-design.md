# Thiết kế module mail

Nguồn yêu cầu: `Đề bài_ OOP.pdf`, gồm cả interface trong ảnh trang 1,
và yêu cầu nghiên cứu, áp dụng sáu pattern/nguyên lý của người dùng.

- Thêm `MailModule` vào NestJS hiện có; endpoint `POST /api/v1/mail/send`.
- `SendMailOptions`: `to`, `subject`, `content`, `isHtml?: boolean`.
  `IMailProvider`: `readonly name: string`,
  `send(options): Promise<{ success: boolean; messageId?: string }>`.
- Hai strategy: `smtp` qua Nodemailer và `mock` chỉ ghi log.
- `MailService` đăng ký/tra cứu `Map<string, IMailProvider>`, không switch.
  `MAIL_DEFAULT_PROVIDER` mặc định `mock`; request được phép ghi đè.
- Nest `useFactory` tạo danh sách provider được bọc logging decorator;
  đây là factory function của DI, không phải GoF Factory Method.
- Adapter SMTP chuyển `content` thành `text` hoặc `html` và chuẩn hóa kết quả.
  SMTP_HOST/PORT/USER/PASS/FROM lấy từ ConfigService; port mặc định 587,
  TLS trực tiếp trên 465. Chỉ kiểm tra cấu hình/kết nối khi dùng SMTP.
- DTO dùng class-validator và ValidationPipe hiện có; thêm boolean `isHtml`.
  Filter riêng của controller bảo toàn danh sách lỗi 400, vì filter chung
  hiện tại chỉ giữ lỗi đầu tiên. Lỗi cấu hình SMTP trả 503, lỗi gửi trả 502,
  không trả chi tiết lỗi từ SMTP cho client.
- Kiểm thử unit và HTTP với MailModule độc lập để không cần PostgreSQL
  hay gửi email thật; toàn bộ test/build vẫn được chạy và báo lỗi có sẵn.

## Các phương án

1. Module trong repo (chọn theo ngữ cảnh hiện tại): dùng lại DI, config,
   validation, Swagger; cần tương thích prefix `/api` và filter chung.
2. App NestJS riêng: chạy độc lập nhưng trùng bộ khung và dependencies.
3. Switch theo provider: ngắn lúc đầu nhưng trái yêu cầu registry của đề.

Không thêm SendGrid/Resend, queue, retry hoặc lưu email: đề chỉ yêu cầu hai
provider. Không thay đổi module thanh toán hoặc sửa test auth/media cũ.

Lựa chọn kỹ thuật do agent quyết định trong phạm vi yêu cầu triển khai;
không yêu cầu triển khai production hay gửi thư tới tài khoản thật.
