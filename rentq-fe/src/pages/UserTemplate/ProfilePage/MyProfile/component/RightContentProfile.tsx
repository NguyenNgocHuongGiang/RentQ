export const RightContentProfile = () => {
  return (
    <div className="space-y-6">
              {/* Tips */}
              <div className="bg-gradient-to-br from-[#E07B39]/10 to-[#ff8c42]/10 rounded-2xl p-6 border border-[#E07B39]/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#E07B39] to-[#ff8c42] rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">💡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Mẹo hay</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>• Đăng ảnh chất lượng cao để thu hút nhiều người xem hơn</p>
                  <p>• Cập nhật thông tin liên lạc để người thuê dễ dàng liên hệ</p>
                  <p>• Mô tả chi tiết về tiện ích xung quanh</p>
                </div>
              </div>

              {/* Popular Posts */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Bài viết phổ biến</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                    <h4 className="font-medium text-sm text-gray-800 mb-1">Phòng trọ gần ĐH Bách Khoa</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>👁 1.2k</span>
                      <span>💬 15</span>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                    <h4 className="font-medium text-sm text-gray-800 mb-1">Tìm bạn ở ghép Q1</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>👁 980</span>
                      <span>💬 22</span>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                    <h4 className="font-medium text-sm text-gray-800 mb-1">Căn hộ mini cao cấp</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>👁 756</span>
                      <span>💬 8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  )
}
