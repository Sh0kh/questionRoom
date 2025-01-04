import { useState } from "react";

export default function WarningModal() {
    const [show, setShow] = useState(true);
    const [agreed, setAgreed] = useState(false);

    const handleContinue = () => {
        if (agreed) {
            setShow(false);
            console.log("User agreed and continued.");
        } else {
            alert("Пожалуйста, подтвердите, что вы не будете списывать.");
        }
    };

    return (
        <div className={`modal2 ${show ? "open" : ""}`}>
            <div
                className={`Modal2Content ${show ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-[30px] pb-[30px]">
                    <div>
                        <h1 className="text-[20px] mb-[15px]">
                            Hurmatli talabalar!
                        </h1>
                        <p className="text- font-medium mb-4">
                            Biz sizga shuni eslatmoqchimizki, imtihon vaqtida aldab yoki internetdan yordam olishga yo‘l qo‘yilmaydi. Bu nafaqat sizga, balki siz bilan birga tahsil olayotgan barchaga adolatli shart-sharoit yaratish uchun juda muhimdir.
                        </p>
                        <p className="text- font-medium mb-4">
                            Shuningdek, test jarayonida diqqat-e’tiboringizni chalg‘itadigan hech qanday tashqi omillarga berilmasligingiz kerak. Har bir ishtirokchining bilim darajasini adolatli baholash uchun har biringizdan mas’uliyat va halollik talab etiladi.
                        </p>
                        <p className="text- font-medium mb-4">
                            Biz ishonamizki, siz imtihonga yetarli darajada tayyorlanib, o‘zingizning haqiqiy bilimlaringizni namoyon eta olasiz. Sizlarning muvaffaqiyatingiz — bu biz uchun ham faxr manbaidir.
                        </p>
                        <p className="text- font-medium mb-4">
                            Imtihon vaqtida hammadan halollikka rioya qilishni va o‘zingizning bilimlaringizga tayanishingizni so‘raymiz.
                        </p>

                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="agreement"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="agreement" className="text-sm">
                                Misollar o'zim ishlayman
                            </label>
                        </div>
                        <button
                            onClick={handleContinue}
                            className={`px-4 py-2 text-white bg-blue-500 rounded ${!agreed ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                                }`}
                            disabled={!agreed}
                        >
                            Davom ettirish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
