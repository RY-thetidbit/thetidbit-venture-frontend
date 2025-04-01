import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);

  // Images for the slider
  const sliderImages = images || [
    {
      url: "https://res.cloudinary.com/thetidbit23024/image/upload/v1743535955/1_cuhzns.png",
      alt: "Ghibli-style image example 1"
    },
    {
      url: "https://res.cloudinary.com/thetidbit23024/image/upload/v1743535965/2_ex8ooh.png",
      alt: "Ghibli-style image example 2"
    },
    {
      url: "https://res.cloudinary.com/thetidbit23024/image/upload/v1743535966/3_jxo701.png",
      alt: "Ghibli-style image example 3"
    },
    {
      url: "https://res.cloudinary.com/thetidbit23024/image/upload/v1743535958/4_ue87s6.png",
      alt: "Ghibli-style image example 4"
    },
    {
      url: "https://res.cloudinary.com/thetidbit23024/image/upload/v1743535957/5_web7qo.png",
      alt: "Ghibli-style image example 5"
    }
  ];

  useEffect(() => {
    // Auto-advance slide every 5 seconds
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      goToNext();
    }, 5000);
  };

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? sliderImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const isLastSlide = currentIndex === sliderImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (slideIndex) => {
    if (isAnimating || currentIndex === slideIndex) return;
    setIsAnimating(true);
    setCurrentIndex(slideIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="slider-container position-relative mb-4 mt-2">
      <h4 className="text-center mb-3">Ghibli Image Gallery</h4>
      <p className="text-center text-muted mb-4">
        Explore what you can create with our Ghibli style image generator
      </p>

      <div className="slider-content shadow rounded-3 overflow-hidden position-relative">
        <div 
          className="slider-image-container ratio ratio-16x9"
          style={{ maxHeight: '500px' }}
        >
          <Image
            src={sliderImages[currentIndex].url}
            alt={sliderImages[currentIndex].alt}
            fill={true}
            className="object-fit-cover transition-opacity"
            priority={true}
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
        
        {/* Navigation arrows */}
        <button
          className="slider-arrow slider-arrow-left btn btn-sm btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2"
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          className="slider-arrow slider-arrow-right btn btn-sm btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y me-2"
          onClick={goToNext}
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>
        
        {/* Dots indicator */}
        <div className="slider-indicators position-absolute bottom-0 start-50 translate-middle-x pb-2 d-flex gap-1">
          {sliderImages.map((_, idx) => (
            <button
              key={idx}
              className={`slider-dot btn btn-sm rounded-circle p-1 ${idx === currentIndex ? 'btn-primary' : 'btn-light opacity-75'}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span className="visually-hidden">Dot</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}