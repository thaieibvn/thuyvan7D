# Crypto Analysis with TradingView Charts

Ứng dụng phân tích dữ liệu cryptocurrency từ Binance với biểu đồ TradingView.

## Tính năng

- Lấy dữ liệu 1000 nến 1D từ Binance API
- Hiển thị biểu đồ nến (candlestick) chuyên nghiệp
- Tính toán và hiển thị Delta Price với đường đỉnh (99%) và đáy (1%)
- Tính toán và hiển thị Delta Volume
- Thống kê xác suất biến động giá
- Giao diện tương tác: zoom, pan, crosshair
- Có thể thay đổi symbol tùy ý

## Cài đặt

1. Clone repository:
```bash
git clone [your-repo-url]
cd crypto-analysis
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy ứng dụng:
```bash
node index.js
```

4. Mở trình duyệt và truy cập:
```
http://localhost:3002
```

## Cấu trúc thư mục

```
project/
  ├── index.js          # Server code
  ├── package.json      # Project dependencies
  ├── README.md         # Project documentation
  └── public/
      └── index.html    # Frontend interface
```

## Công nghệ sử dụng

- Node.js
- Express
- TradingView Lightweight Charts
- Binance API
- Axios

## API Endpoints

- `GET /api/data/:symbol`: Lấy dữ liệu phân tích cho một symbol cụ thể

## Công thức tính toán

1. Delta Price:
   - `delta_price = current_close - close_7d_ago`

2. Delta Volume:
   - `delta_volume = (current_volume / volume_7d_ago * 100) - 100`

3. Xác suất:
   - Peak: giá trị delta price ở ngưỡng 99%
   - Bottom: giá trị delta price ở ngưỡng 1%

## License

MIT

## Đóng góp

Mọi đóng góp đều được chào đón. Vui lòng:
1. Fork dự án
2. Tạo branch mới
3. Commit thay đổi của bạn
4. Push lên branch
5. Tạo Pull Request

## Tác giả

[Your Name]
