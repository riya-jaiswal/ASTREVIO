import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer"; // Import useInView
import Image1 from "../assets/10.jpeg";
import ProfileImage1 from "../assets/Testimonial/Image1.png";
import ProfileImage2 from "../assets/Testimonial/Image1.png";
import ProfileImage3 from "../assets/Testimonial/Image1.png";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Intersection Observer Hook
  const { ref, inView } = useInView({
    triggerOnce: false, // Trigger every time the section enters the viewport
    threshold: 0.3, // Trigger when 30% of the section is visible
  });

  const testmonialData = [
    {
      message:
        "Reliable, professional, and efficient in supplying and distributing high-quality agricultural products.",
      profile: ProfileImage1 || "https://via.placeholder.com/64",
      name: "Sophie Carter",
      location: "New York, USA",
    },
    {
      message:
        "Excellent service in trading, processing, and marketing agricultural products with utmost dedication.",
      profile: ProfileImage2 || "https://via.placeholder.com/64",
      name: "James Lee",
      location: "San Francisco, USA",
    },
    {
      message:
        "Trusted partner for exporting and supplying premium agricultural products seamlessly.",
      profile: ProfileImage3 || "https://via.placeholder.com/64",
      name: "Emma Brown",
      location: "London, UK",
    },
    {
      message:
        "Consistently delivers quality products with efficient processing and distribution.",
      profile: ProfileImage3 || "https://via.placeholder.com/64",
      name: "Emma Brown",
      location: "London, UK",
    },
  ];

  // On small screens, show 1 card per slide; on large screens, show 2 cards per slide
  const getCardsPerSlide = () => (window.innerWidth < 768 ? 1 : 2);
  const [cardsPerSlide, setCardsPerSlide] = useState(getCardsPerSlide());

  // Recalculate total slides based on cards per slide
  const totalSlides = Math.ceil(testmonialData.length / cardsPerSlide);

  // Update cards per slide on window resize
  useEffect(() => {
    const handleResize = () => {
      setCardsPerSlide(getCardsPerSlide());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Adjust currentIndex if it exceeds the new totalSlides after resize
  useEffect(() => {
    if (currentIndex >= totalSlides) {
      setCurrentIndex(totalSlides - 1);
    }
  }, [totalSlides, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    setIsPaused(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    setIsPaused(true);
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
      }, 3000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPaused, totalSlides]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Animation variants for different directions with delay
  const cardVariants = (index) => ({
    hidden: {
      opacity: 0,
      x: index % 3 === 0 ? -100 : index % 3 === 1 ? 100 : 0,
      y: index % 3 === 2 ? 100 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: (index % cardsPerSlide) * 0.2, // Staggered delay for each card
      },
    },
    exit: {
      opacity: 0,
      x: index % 3 === 0 ? 100 : index % 3 === 1 ? -100 : 0,
      y: index % 3 === 2 ? -100 : 0,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  });

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 p-6 md:p-20 gap-10 relative" ref={ref}>
      <div className="space-y-6">
        <img
          src={Image1 || "https://via.placeholder.com/600x400"}
          alt="Testimonial background"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/600x400";
          }}
        />
        <div className="flex gap-6">
          <button
            className="bg-[#F1F1F1] p-2 rounded-xs"
            onClick={handlePrev}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              fontSize={25}
              className="text-[#464646]"
            />
          </button>
          <button
            className="bg-[#F1F1F1] p-2 rounded-xs"
            onClick={handleNext}
          >
            <FontAwesomeIcon
              icon={faArrowRight}
              fontSize={25}
              className="text-[#464646]"
            />
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-[#0094FF] font-1 font-semibold text-3xl md:text-4xl lg:text-5xl">
          What Our Customers Say About Us
        </h2>
      </div>
      <section className="md:top-[30%] md:left-[30%] lg:absolute w-full lg:w-auto">
        <div
          className="relative lg:p-6 bg-white md:max-w-4xl md:mx-auto rounded-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="overflow-hidden">
            <AnimatePresence>
              <motion.div
                className="flex gap-6"
                style={{
                  transform: `translateX(-${currentIndex * (100 / cardsPerSlide)}%)`,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {testmonialData.map((data, index) => (
                  <motion.div
                    key={index}
                    className={`flex-none w-[calc(100%-20px)] md:w-[calc(50%-24px)] min-h-96 bg-[#1F1F1F] p-6 md:p-6 space-y-6`}
                    variants={cardVariants(index)}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"} // Animate only when in view
                    exit="exit"
                  >
                    <h2 className="text-white text-6xl font-semibold font-serif">
                      “
                    </h2>
                    <p className="text-white text-lg">{data.message}</p>
                    <section className="flex items-center gap-6">
                      <div>
                        <img
                          src={data.profile}
                          className="w-16 h-16 rounded-full object-cover"
                          alt={`${data.name}'s profile`}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/64";
                          }}
                        />
                      </div>
                      <div>
                        <h2 className="text-white font-bold text-xl">
                          {data.name}
                        </h2>
                        <h3 className="text-[#929292] font-semibold">
                          {data.location}
                        </h3>
                      </div>
                    </section>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Testimonial;