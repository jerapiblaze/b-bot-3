# duyệt cfs (chỉ dành cho admin/mod)
chỉ admin/mod mới dùng được thôi, đừng cố làm gì

## duyệt cfs
- cách làm: react ✅
- diễn biến tiếp theo: 
  - bot lag khoảng 1s, sau đó sẽ react ⏳
  - lag tiếp 1-2s nữa 
    - nếu đăng thành công: cho cái cfs 1 màu xanh 🟩 cùng chiếc react 🆗, xong nhiệm vụ
    - nếu đăng fail (zucc chặn), bot nhả chiếc react ❌ và 🔁. lúc này cần phải:
      - đợi 1 khoảng thời gian
      - react 🔁
      - quay lại từ đầu
- lưu ý quan trọng: ***duyệt từ tốn, nhanh vừa phải thôi kẻo bot bị khoá mõm***

## bỏ cfs
- cách làm: react ⛔
- diễn biến tiếp theo:
  - bot lag khoảng 1s, sau đó react 🔁
- lưu ý: đừng bấm nhanh quá xong kêu bot lag nhớ

## duyệt 1 cfs đã bị bỏ
- cách làm: react 🔁, sau đó react ✅

## xoá toàn bộ tags
- cách làm: react 🧹
- diễn biến tiếp theo:
  - bot lag khoảng 1-2s, sau đó tags sẽ bị xoá
- lưu ý: chỉ thực hiện được khi ***chưa duyệt*** cfs

## thêm tag
- cách làm: react với icon ứng với tags (xem trong link gửi cfs)
- diễn biến tiếp theo:
  - bot lag khoảng 1-2s, sau đó tag sẽ được thêm vào (nếu đùng icon, còn không thì react sẽ bị gỡ)
- lưu ý: chỉ thực hiện được khi ***chưa duyệt*** cfs

# gọi hồn một cfs bị lỡ/bị chặn trong kênh raw
- cách làm:
  - cfs bị lỡ (cfs không có react nào): react 🔁
  - cfs bị chặn (cfs có react ⚠): react 🔂
  - nếu thành công sẽ có react 🆗
- lưu ý: thường thì cfs bị lỡ vào khoảng ngày 21-25 hàng tháng (do host đá đít bot vì hết giờ free)