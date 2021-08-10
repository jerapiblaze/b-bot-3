# duyệt cfs (chỉ dành cho admin)

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

## bỏ cfs
- cách làm: react ⛔
- diễn biến tiếp theo:
  - bot lag khoảng 1s, sau đó react 🔁

## xoá toàn bộ tags
- cách làm: react 🧹
- diễn biến tiếp theo:
  - bot lag khoảng 1-2s, sau đó tags sẽ bị xoá
- lưu ý: chỉ thực hiện được khi chưa duyệt cfs

## thêm tag
- cách làm: react với icon ứng với tags (xem trong link gửi cfs)
- diễn biến tiếp theo:
  - bot lag khoảng 1-2s, sau đó tag sẽ được thêm vào (nếu đùng icon, còn không thì react sẽ bị gỡ)
- lưu ý: chỉ thực hiện được khi chưa duyệt cfs