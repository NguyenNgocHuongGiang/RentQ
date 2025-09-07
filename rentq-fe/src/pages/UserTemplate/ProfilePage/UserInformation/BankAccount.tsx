import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dataBanks from "./dataBank.json";
import { getAuthData } from "../../../../utils/helpers";
import { AppDispatch } from "../../../../store";
import { useDispatch, useSelector } from "react-redux";
import { createBankAccount, getBankAccount } from "../../../../store/slice/userSlice";
import { BankAccountType } from "../../../../types/types";
import { BankOutlined, CreditCardOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Button, Card, Steps, List, Empty } from "antd";

const { Step } = Steps;

export default function BankAccountWizard() {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedBank, setSelectedBank] = useState<string>("");
    const userId = getAuthData()?.userId;
    const dispatch = useDispatch<AppDispatch>();
    const [form] = Form.useForm();

    const { listBankAccount } = useSelector((state: any) => state.userReducer);
    const selectedBankInfo = dataBanks.find(bank => bank.code === selectedBank);

    useEffect(() => {
        if (userId) dispatch(getBankAccount(userId));
    }, [userId, dispatch]);

    const handleNext = () => setCurrentStep((prev) => prev + 1);
    const handlePrev = () => setCurrentStep((prev) => prev - 1);

    const handleAddBank = (values: any) => {
        const dataBankNew: BankAccountType = {
            ...values,
            bank_code: selectedBank,
            user_id: userId,
            branch: values.branch || "",
            is_default: true,
            bank_name: dataBanks.find(bank => bank.code === selectedBank)?.name,
            bank_bin: dataBanks.find(bank => bank.code === selectedBank)?.bin || ""
        };
        dispatch(createBankAccount(dataBankNew))
            .unwrap()
            .then(() => {
                toast.success("Thêm tài khoản ngân hàng mới thành công");
                form.resetFields();
                setSelectedBank("");
                setCurrentStep(0);
            })
            .catch((err) => toast.error(err.message));
    };

    const handleBankSelect = (bankCode: string) => {
        setSelectedBank(bankCode);
        form.setFieldsValue({ bank_code: bankCode });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Steps current={currentStep} direction="horizontal" className="!mb-6 !w-3/4 !mx-auto">
                <Step title="Tài khoản hiện có" />
                <Step title="Thêm tài khoản ngân hàng" />
            </Steps>

            {currentStep === 0 && (
                <Card className="p-6">
                    {listBankAccount?.length ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={listBankAccount}
                            renderItem={(bank: any) => {
                                const bankInfo = dataBanks.find((b) => b.code === bank.bank_code);
                                return (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<img src={bankInfo?.logo} className="w-16 h-16 object-contain" />}
                                            title={bankInfo?.name}
                                            description={`${bank.account_holder} - ${bank.account_number} ${bank.is_default ? "(Mặc định)" : ""}`}
                                        />
                                    </List.Item>
                                );
                            }}
                        />
                    ) : (
                        <div>
                            <Empty description="Chưa có tài khoản ngân hàng nào." />
                        </div>
                    )}
                    <div className="text-center mt-6">
                        <Button type="primary" onClick={handleNext} className="w-1/2 !bg-[#0A2E50] !text-white p-3 mt-2 mb-5 rounded-lg hover:bg-[#E07B39] hover:font-bold hover:cursor-pointer"
                        >
                            Thêm tài khoản mới →
                        </Button>
                    </div>
                </Card>
            )}

            {currentStep === 1 && (
                <Card className="p-3">
                    <Form form={form} layout="vertical" onFinish={handleAddBank} className="space-y-3">
                        {/* Bank Selection */}
                        <Form.Item
                            label={<span className="text-base font-medium text-gray-700 flex items-center gap-2"><BankOutlined /> Chọn Ngân Hàng</span>}
                            name="bank_code"
                            rules={[{ required: true, message: "Vui lòng chọn ngân hàng" }]}
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
                                {dataBanks.map((bank) => (
                                    <div
                                        key={bank.code}
                                        onClick={() => handleBankSelect(bank.code)}
                                        className={`relative cursor-pointer rounded-xl p-2 border-2 transition-all duration-200 hover:shadow-md
                      ${selectedBank === bank.code
                                                ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className="flex items-center justify-center rounded-xl shadow-md bg-white transition-transform">
                                                <img src={bank.logo} alt={bank.shortName} className="w-20 h-20 object-contain" />
                                            </div>
                                            <span className="text-sm font-medium text-center text-gray-700 leading-tight">{bank.shortName}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Form.Item>

                        {selectedBankInfo && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-3">
                                    <img src={selectedBankInfo.logo} alt={selectedBankInfo.shortName} className="h-10 object-contain" />
                                    <span className="font-medium text-blue-800">Đã chọn: {selectedBankInfo.name}</span>
                                </div>
                            </div>
                        )}

                        {/* Account Information */}
                        <Form.Item label="Số tài khoản" name="account_number" rules={[{ required: true, message: "Vui lòng nhập số tài khoản" }, { pattern: /^[0-9]{6,20}$/, message: "Số tài khoản phải từ 6-20 chữ số" }]}>
                            <Input size="large" prefix={<CreditCardOutlined className="text-gray-400 mr-2" />} className="rounded-lg !border-black" />
                        </Form.Item>

                        <Form.Item label="Tên chủ tài khoản" name="account_holder" rules={[{ required: true, message: "Vui lòng nhập tên chủ tài khoản" }, { min: 2, message: "Tên phải có ít nhất 2 ký tự" }]}>
                            <Input size="large" prefix={<UserOutlined className="text-gray-400 mr-2" />} className="rounded-lg !border-black" />
                        </Form.Item>

                        <Form.Item label="Chi nhánh" name="branch">
                            <Input size="large" prefix={<BankOutlined className="text-gray-400 mr-2" />} className="rounded-lg !border-black" />
                        </Form.Item>

                        <div className="flex justify-between mt-4">
                            <Button onClick={handlePrev}>Quay lại</Button>
                            <Button type="primary" htmlType="submit" disabled={!selectedBank} className="!bg-[#0A2E50] !text-white p-3 mt-2 mb-5 rounded-lg hover:bg-[#E07B39] hover:font-bold hover:cursor-pointer">
                                Lưu thông tin
                            </Button>
                        </div>
                    </Form>
                </Card>
            )}
        </div>
    );
}
