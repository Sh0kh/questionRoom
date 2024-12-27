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
                <div className="p-[10px] pb-[30px]">
                    <div>
                        <p className="text-lg font-medium mb-4">
                            Убедитесь, что вы решаете задачу самостоятельно и не будете списывать.
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
                                Я обещаю решать задачу самостоятельно.
                            </label>
                        </div>
                        <button
                            onClick={handleContinue}
                            className={`px-4 py-2 text-white bg-blue-500 rounded ${!agreed ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                                }`}
                            disabled={!agreed}
                        >
                            Продолжить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
