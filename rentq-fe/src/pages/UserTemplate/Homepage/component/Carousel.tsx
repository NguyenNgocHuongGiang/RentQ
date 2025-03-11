import { useState, useEffect } from "react";

const images = [
  "https://cdn.apartmenttherapy.info/image/upload/v1721664961/stock/GettyImages-2151791351.jpg",
  "https://images.nestseekers.com/_next/image?url=https://photos.nestseekers.com/Apt/20A-ED-REVISED-LR-WEST_AxZuhB8.jpg&w=3840&q=70",
  "https://cdn.sanity.io/images/v48q37k7/production/889b956e0436d389ce2ba1289bad1de2b09ddb57-3600x2400.jpg?auto=format&fit=max&q=50&w=1800",
  "https://cdn.prod.website-files.com/6298896e3cd8b96e5bded05d/62eb5859a0587e56baeedaea_Carrying-Boxes-Relocating-New-Flat.jpg",
  "https://cdn.sanity.io/images/v48q37k7/production/d09208183125ab47493d5de2f8710b6faa27d7cc-3000x2000.jpg?auto=format&fit=max&q=90&w=1500",
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative w-full">
      <div className="relative h-80 md:h-[500px] overflow-hidden">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            className={`absolute block w-full max-h-[500px] object-cover transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            alt="Slide"
          />
        ))}
      </div>
    </div>
  );
}
