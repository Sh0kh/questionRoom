import { useState } from "react";

export default function WarningModal({ startExam }) {
    const [show, setShow] = useState(true);
    const [agreed, setAgreed] = useState(false);

    const handleContinue = () => {
        if (agreed) {
            setShow(false);
            startExam(true);
        } else {
            alert("Пожалуйста, подтвердите, что вы не будете списывать.");
        }
    };

    return (
        <div className={`modal2 ${show ? "open" : ""}`}>
            <div
                className={`Modal3Content ${show ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-[30px] pb-[30px]">
                    <div>
                        <h1 className="text-[20px] mb-[15px]">
                            Eslatma !!!
                        </h1>
                        <p className="text- font-medium mb-4">
                            Imtihon Shartlari
                        </p>
                        <ol className="list-decimal pl-[22px]">
                            <li className="mb-[10px]">
                                Imtihon tashkilotchilari tomonidan taqdim etilgan kompyuterda ishlash shart.
                            </li>
                            <li className="mb-[10px]">
                                Imtihon boshlanishidan oldin shaxsni tasdiqlovchi hujjat taqdim etilishi shart.
                            </li>
                            <li className="mb-[10px]">
                                Imtihon davomida faqat tashkilotchilar tomonidan ruxsat etilgan materiallar va qurilmalardan foydalanish shart.
                            </li>
                            <li className="mb-[10px]">
                                Imtihon vaqtida brauzerda savol-xona.uz dan boshqa tabga o’tish man etiladi.
                            </li>
                            <li className="mb-[10px]">
                                Imtihon vaqtida tashqaridan yordam olish qat’iyan taqiqlanadi.
                            </li>
                            <li className="mb-[10px]">
                                Test savollarini va ularga javoblarni hech qanday shaklda nusxalash, ulashish yoki tarqatish man etiladi.
                            </li>
                            <li className="mb-[10px]">
                                Imtihon vaqtida xona ichida tartib va sukunatni saqlash shart.
                            </li>
                            <li className="mb-[10px]">
                                Imtihon tashkilotchilari tomonidan belgilangan vaqtga qat’iy rioya qilish shart. Belgilangan vaqt tugagach, imtihon tugallanishi kerak.
                            </li>
                            <li className="mb-[10px]">
                                Imtihon davomida monitoring qilish uchun kamera yoki boshqa kuzatuv tizimlaridan foydalanish mumkin, bunga rozilik bildirish shart.
                            </li>
                            <li className="mb-[10px]">
                                Qoidalarni buzgan holda ishtirokchi imtihondan chetlatilishi va natijalari bekor qilinishi mumkin.
                            </li>
                            <li className="mb-[10px]">
                                Imtihon tugaganidan keyin barcha natijalar tashkilotchilar tomonidan avtomatik ravishda qabul qilinadi.
                            </li>
                        </ol>
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="agreement"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="agreement" className="text-sm">
                                Shartlar bilan tanishib chiqdim
                            </label>
                        </div>
                        <button
                            onClick={handleContinue}
                            className={`px-4 py-2 text-white bg-blue-500 rounded ${!agreed ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                                }`}
                            disabled={!agreed}
                        >
                            Imtihonni boshlash
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
