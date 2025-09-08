import { Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";

export default function Header({ timeLeft, setOpenModal }) {
    const [scrolled, setScrolled] = useState(false);

    // следим за скроллом
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // форматируем минуты и секунды
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    return (
        <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 w-[97%] 
                  transition-all duration-300 backdrop-blur-md
                  rounded-2xl px-6 py-4 flex justify-between items-center z-50
                  ${scrolled
                    ? "bg-white/70 shadow-xl"
                    : "bg-white shadow-md"}`}
        >
            {/* Таймер */}
            <div className="text-lg font-semibold text-gray-800">
                Qolgan vaqt:{" "}
                <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>

            {/* Кнопка */}
            <Button onClick={() => setOpenModal(true)} color="red" className="rounded-xl shadow-md">
                Tugatish
            </Button>
        </div>
    );
}
