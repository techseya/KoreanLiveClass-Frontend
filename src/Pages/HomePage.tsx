import "../Common/styles/home.css";
import { useEffect, useState } from "react";
import img1 from "../Assets/Images/curriculum.png";
import img2 from "../Assets/Images/teacher.png";
import img3 from "../Assets/Images/clock.png";

export default function HomePage() {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [animate, setAnimate] = useState(true);
    const [typedText, setTypedText] = useState("");

    const sentences = ["17 Online courses", "Expert instruction", "Access anytime"];
    const images = [img1, img2, img3];
    const fullTitle = "Korean live class";

    // Typing animation for title
    useEffect(() => {
        let index = 0;
        const typingInterval = setInterval(() => {
            setTypedText(fullTitle.slice(0, index + 1));
            index++;

            if (index === fullTitle.length) {
                clearInterval(typingInterval);
            }
        }, 300);

        return () => clearInterval(typingInterval);
    }, []);

    // Looping animated icon + sentence
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimate(false);
            setTimeout(() => {
                setCurrentTextIndex((prev) => (prev + 1) % sentences.length);
                setAnimate(true);
            }, 100);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="homepage">
            <main className="main-content">
                <div className="main-inner main-img"></div>
                <div className="main-inner main-img2">
                    <div className="main-sub-inner">
                        <div className="main-content-title typing">
                            {typedText}
                            <span className="cursor">|</span>
                        </div>
                        <div className="main-content-desc">
                            Study korean language anytime, anywhere!
                        </div>
                        <div className={`slide-text ${animate ? "animate" : ""}`}>
                            <div className="anime-outer">
                                <div className="anime-inner">
                                    <img
                                        className="anime-logo"
                                        src={images[currentTextIndex]}
                                        alt=""
                                    />
                                    {sentences[currentTextIndex]}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
