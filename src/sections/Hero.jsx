import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image1 from "../assets/10.jpeg";
import Image2 from "../assets/5.jpeg";
import { useDispatch } from "react-redux";

function Hero() {
  const [inView, setInView] = useState({ top: false, bottom: false });
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === topRef.current && entry.isIntersecting) {
            setInView((prev) => ({ ...prev, top: true }));
          }
          if (entry.target === bottomRef.current && entry.isIntersecting) {
            setInView((prev) => ({ ...prev, bottom: true }));
          }
        });
      },
      { threshold: 0.2 }
    );

    if (topRef.current) observer.observe(topRef.current);
    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => {
      if (topRef.current) observer.unobserve(topRef.current);
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, []);

  return (
    <section className="p-6 md:p-10 lg:p-20 space-y-6 overflow-hidden">
      {/* Top Section */}
      <div
        ref={topRef}
        className="grid grid-cols-1 md:grid-cols-3 justify-between items-center gap-8 overflow-hidden"
      >
        <motion.div
          className="space-y-6 md:space-y-12 col-span-2"
          initial={{ x: -100, opacity: 0 }}
          animate={inView.top ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Diagonal Gradient Heading */}
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-600 to-cyan-400 bg-clip-text text-transparent">
            Your Global Partner in Agriculture
          </h1>

          <p className="paragraph-1">
            Dedicated to exporting, trading, supplying, distributing, processing,
            and packaging high-quality agricultural products, we ensure
            reliability, consistency, and trust in every delivery.
          </p>

          {/* Gradient Button - same position */}
          <button
            className="py-2.5 px-6 text-base font-semibold font-1 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-md hover:scale-105 transition"
            onClick={() => {
              dispatch({ type: "open" });
            }}
          >
            Start A Project
          </button>
        </motion.div>

        <motion.div
          className="flex justify-center md:justify-end"
          initial={{ x: 100, opacity: 0 }}
          animate={inView.top ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src={Image1}
            className="h-60 md:h-72 object-contain"
            alt="Design"
          />
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div
        ref={bottomRef}
        className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 overflow-hidden"
      >
        {/* Left - Stats */}
        <motion.div
          className="space-y-6"
          initial={{ y: 100, opacity: 0 }}
          animate={inView.bottom ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Stats - Responsive */}
          <div>
            <ul className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <li className="space-y-1 text-center sm:text-left border p-1 rounded-sm flex justify-center items-center flex-col">
                <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-blue-600 to-cyan-400 bg-clip-text text-transparent">
                  400+
                </h3>
                <p className="paragraph-1">Project Complete</p>
              </li>
              <li className="space-y-1 text-center sm:text-left border p-1 rounded-sm flex flex-col justify-center items-center">
                <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-blue-600 to-cyan-400 bg-clip-text text-transparent">
                  600+
                </h3>
                <p className="paragraph-1">Satisfied Clients</p>
              </li>
              <li className="space-y-1 text-center sm:text-left border p-1 rounded-sm flex flex-col justify-center items-center">
                <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-blue-600 to-cyan-400 bg-clip-text text-transparent">
                  100+
                </h3>
                <p className="paragraph-1">Unique Styles</p>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Right - Image */}
        <motion.div
          className="flex justify-center md:justify-end"
          initial={{ x: 100, opacity: 0 }}
          animate={inView.bottom ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src={Image2}
            className="h-60 md:h-72 object-contain"
            alt="Interior"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
