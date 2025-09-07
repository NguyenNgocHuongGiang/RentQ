import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import { FaHome, FaPlus, FaUser } from 'react-icons/fa';
import AddRoomFinderModal from '../../../../../components/Modal/AddRoomFinderModal';
import { Modal } from "antd";
import { AddRoomRequestModal } from '../../../../../components/Modal/AddRoomRequestModal';

interface LeftContentProfileProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
}

export const LeftContentProfile: React.FC<LeftContentProfileProps> = ({
    isModalOpen,
    setIsModalOpen,
}) => {
    const [showAddRoomFinder, setShowAddRoomFinder] = useState(false);
    const [showAddRoomRequest, setShowAddRoomRequest] = useState(false);

    const { listPostProfile } = useSelector((state: RootState) => state.roomFinderReducer);
    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    return (
        <>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thao tác nhanh</h3>

                {/* Create Post Button */}
                <button
                    onClick={handleOpen}
                    className="w-full mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 group"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#E07B39] to-[#ff8c42] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                            <FaPlus className="text-white text-xl" />
                        </div>
                        <span className="text-gray-700 font-medium">Tạo bài viết mới</span>
                        <span className="text-gray-500 text-sm mt-1">Chia sẻ nhu cầu của bạn</span>
                    </div>
                </button>

                {/* Stats */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Tổng bài viết</span>
                        <span className="font-semibold text-[#E07B39]">{listPostProfile?.length ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Bài viết tìm trọ</span>
                        <span className="font-semibold text-green-600">{listPostProfile?.filter(post => post.label === "room_finder").length ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Bài viết cho thuê</span>
                        <span className="font-semibold text-blue-600">{listPostProfile?.filter(post => post.label === "post").length ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Bài viết tìm người ở ghép</span>
                        <span className="font-semibold text-blue-600">{listPostProfile?.filter(post => post.label === "roommate_requests").length ?? 0}</span>
                    </div>

                </div>
            </div>

            {/* Enhanced Modal */}
            <Modal
                title={null}
                open={isModalOpen}
                onCancel={handleClose}
                footer={null}
                centered
                className="!p-0"
                width={500}
            >
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#E07B39] to-[#ff8c42] rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaHome className="text-white text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Nhu cầu hiện tại của bạn?</h3>
                        <p className="text-gray-600">Chọn lựa chọn phù hợp để chúng tôi hỗ trợ bạn tốt nhất</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            className="w-full p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl hover:from-blue-100 hover:to-blue-200 hover:shadow-lg transition-all duration-300 group text-left"
                            onClick={() => {
                                setShowAddRoomRequest(true);
                                handleClose();
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <FaHome className="text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">Tôi đã có trọ</h4>
                                    <p className="text-sm text-gray-600">Tìm người ở ghép, chia sẻ chi phí</p>
                                </div>
                            </div>
                        </button>

                        <button
                            className="w-full p-6 bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-2xl hover:from-green-100 hover:to-emerald-200 hover:shadow-lg transition-all duration-300 group text-left"
                            onClick={() => {
                                setShowAddRoomFinder(true);
                                handleClose();
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <FaUser className="text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">Tôi đang tìm trọ</h4>
                                    <p className="text-sm text-gray-600">Tìm kiếm chỗ ở phù hợp với nhu cầu</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={handleClose}
                            className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors duration-300 text-center"
                        >
                            Huỷ bỏ
                        </button>
                    </div>
                </div>
            </Modal>

            <AddRoomFinderModal open={showAddRoomFinder} onClose={() => setShowAddRoomFinder(false)} />
            <AddRoomRequestModal open={showAddRoomRequest} onClose={() => setShowAddRoomRequest(false)} />
        </>
    )
}
