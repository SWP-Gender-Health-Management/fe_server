# Hệ Thống Theo Dõi Chu Kỳ Kinh Nguyệt

## Tổng Quan

Trang theo dõi chu kỳ kinh nguyệt được thiết kế để giúp phụ nữ theo dõi và dự đoán chu kỳ kinh nguyệt của mình một cách chính xác và khoa học.

## Đường Dẫn

- **URL**: `/dich-vu/chu-ky-kinh-nguyet`
- **Component chính**: `src/pages/MenstrualPredictor/MenstrualPredictorPage.jsx`

## API Endpoints Sử Dụng

### 1. Kiểm tra trạng thái theo dõi

```
GET /customer/get-menstrual-cycle
```

- **Mục đích**: Kiểm tra xem customer đã có thông tin theo dõi chu kì hay chưa
- **Response**: `{ result: true/false }`
- **Xử lý**:
  - `true`: Chuyển sang bước 2 để lấy dữ liệu dự đoán
  - `false`: Hiển thị form thiết lập ban đầu

### 2. Tạo thông tin theo dõi mới

```
POST /customer/track-period
Body: {
  start_date: "2024-01-01T00:00:00.000Z",
  end_date: "2024-01-05T00:00:00.000Z",
  period: 5,
  note: "Thiết lập theo dõi chu kỳ"
}
```

- **Mục đích**: Tạo thông tin theo dõi ban đầu cho customer mới
- **Sử dụng**: Trong `SetupMenstrualForm` khi user hoàn thành thiết lập

### 3. Lấy dữ liệu dự đoán

```
GET /customer/predict-period
```

- **Response**:

```json
{
  "data": {
    "current_start_date": "2024-01-01",
    "current_end_date": "2024-01-05",
    "current_period": 5,
    "current_note": "Chu kỳ hiện tại",
    "periodDaysMap": {
      "2024-0": [1, 2, 3, 4, 5]
    },
    "ovulationDaysMap": {
      "2024-0": [14, 15]
    },
    "notiDate": "2024-1-1"
  }
}
```

### 4. Cập nhật thông tin chu kỳ

```
POST /customer/update-menstrual-cycle
Body: {
  start_date: "2024-01-01T00:00:00.000Z",
  end_date: "2024-01-05T00:00:00.000Z",
  note: "Cập nhật chu kỳ"
}
```

- **Mục đích**: Cập nhật thông tin chu kỳ hiện tại
- **Sử dụng**: Trong `CycleSettingsCard` khi user muốn chỉnh sửa

## Luồng Hoạt Động

### 1. User Mới (Chưa có dữ liệu)

1. Truy cập trang → Loading spinner hiển thị
2. API check `/get-menstrual-cycle` → Trả về `false`
3. Hiển thị `SetupMenstrualForm` với 2 tùy chọn:
   - **Thiết lập chi tiết**: Nhập ngày bắt đầu/kết thúc cụ thể
   - **Thiết lập nhanh**: Chọn từ các giá trị có sẵn
4. Submit form → Gọi API `/track-period`
5. Chuyển sang giao diện chính

### 2. User Có Sẵn Dữ Liệu

1. Truy cập trang → Loading spinner hiển thị
2. API check `/get-menstrual-cycle` → Trả về `true`
3. Gọi API `/predict-period` → Lấy dữ liệu đầy đủ
4. Hiển thị giao diện chính với 6 thành phần

## Các Component Chính

### 1. CalendarView

- **File**: `components/CalendarView.jsx`
- **Chức năng**: Hiển thị lịch với ngày hành kinh và rụng trứng
- **Dữ liệu**: `periodDays`, `ovulationDays` từ API

### 2. CurrentPhaseCard

- **File**: `components/CurrentPhaseCard.jsx`
- **Chức năng**: Hiển thị giai đoạn chu kỳ hiện tại
- **Các giai đoạn**:
  - Menstrual (Kỳ hành kinh)
  - Follicular (Kỳ nang trứng)
  - Ovulation (Kỳ rụng trứng)
  - Luteal (Kỳ hoàng thể)

### 3. CycleSettingsCard

- **File**: `components/CycleSettingsCard.jsx`
- **Chức năng**: Cho phép cập nhật thông tin chu kỳ
- **API**: Sử dụng `/update-menstrual-cycle`

### 4. PredictionsCard

- **File**: `components/PredictionsCard.jsx`
- **Chức năng**: Hiển thị dự đoán chu kỳ tiếp theo
- **Thông tin**: Ngày kinh tiếp theo, ngày rụng trứng, thời kỳ dễ thụ thai

### 5. HealthTipsCard

- **File**: `components/HealthTipsCard.jsx`
- **Chức năng**: Hiển thị lời khuyên sức khỏe theo giai đoạn

### 6. SetupMenstrualForm

- **File**: `components/SetupMenstrualForm.jsx`
- **Chức năng**: Form thiết lập ban đầu cho user mới
- **Tính năng**: 3 bước thiết lập, 2 chế độ (chi tiết/nhanh)

## Xử Lý Lỗi

### Lỗi API

- **401 Unauthorized**: Phiên đăng nhập hết hạn
- **404 Not Found**: Không có dữ liệu → Chuyển sang setup form
- **400 Bad Request**: Dữ liệu không hợp lệ → Chuyển sang setup form
- **Connection Error**: Lỗi kết nối → Hiển thị thông báo

### Fallback

- Nếu có lỗi không xác định → Hiển thị setup form
- Loading state trong khi kiểm tra dữ liệu
- Validation form đầy đủ

## Tính Năng Nổi Bật

### 1. Two-Step API Flow

- Kiểm tra trạng thái trước khi fetch dữ liệu
- Tối ưu performance và UX

### 2. Smart Setup Process

- 2 chế độ thiết lập phù hợp mọi user
- Validation nghiêm ngặt
- UI/UX hiện đại với Steps và Radio buttons

### 3. Intelligent Predictions

- Tính toán dựa trên dữ liệu lịch sử
- Dự đoán 4 giai đoạn chu kỳ
- Hiển thị thời kỳ dễ thụ thai

### 4. Responsive Design

- Tương thích mobile và desktop
- Glass morphism effects
- Gradient backgrounds

## Cấu Trúc Thư Mục

```
src/pages/MenstrualPredictor/
├── MenstrualPredictorPage.jsx      # Component chính
├── MenstrualPredictorPage.css      # Styles chính
└── components/
    ├── CalendarView.jsx            # Lịch kinh nguyệt
    ├── CalendarView.css
    ├── CurrentPhaseCard.jsx        # Giai đoạn hiện tại
    ├── CurrentPhaseCard.css
    ├── CycleSettingsCard.jsx       # Cài đặt chu kỳ
    ├── CycleSettingsCard.css
    ├── PredictionsCard.jsx         # Dự báo
    ├── PredictionsCard.css
    ├── HealthTipsCard.jsx          # Lời khuyên sức khỏe
    ├── HealthTipsCard.css
    ├── SetupMenstrualForm.jsx      # Form thiết lập
    └── SetupMenstrualForm.css
```

## Development

### Chạy Development Server

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:5174/`

### Testing

1. Truy cập `/dich-vu/chu-ky-kinh-nguyet`
2. Test với user mới (không có token hoặc dữ liệu)
3. Test với user có sẵn dữ liệu
4. Test các chức năng cập nhật

### Debugging

- Check console logs để theo dõi API calls
- Kiểm tra Network tab để xem response data
- Sử dụng React DevTools để debug state

## Lưu Ý Quan Trọng

1. **Authentication**: Cần có `accessToken` trong cookies
2. **API Base URL**: `http://localhost:3000`
3. **Date Format**: Sử dụng ISO string cho API calls
4. **Validation**: Form có validation đầy đủ để đảm bảo data quality
5. **Performance**: Sử dụng useCallback để tối ưu re-renders

## Troubleshooting

### Trang hiển thị trắng

- Kiểm tra console errors
- Verify API endpoints đang hoạt động
- Check token authentication

### Dữ liệu không hiển thị

- Kiểm tra API response format
- Verify periodDaysMap và ovulationDaysMap structure
- Check date calculations

### Setup form không hoạt động

- Verify `/track-period` API
- Check form validation rules
- Ensure proper date formatting
