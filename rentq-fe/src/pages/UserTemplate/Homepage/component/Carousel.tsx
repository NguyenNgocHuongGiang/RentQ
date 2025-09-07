import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1651336259530-362bce65fffe?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1800&q=80",
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-screen-xl mx-auto">
      {/* Slides */}
      <div className="relative h-80 md:h-[500px] overflow-hidden rounded-lg shadow-lg">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition-colors duration-300"
        >
          <FaChevronLeft size={20} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition-colors duration-300"
        >
          <FaChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 w-full flex justify-center space-x-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                idx === currentIndex
                  ? "bg-[#E07B39]"
                  : "bg-white/70 hover:bg-[#E07B39]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
