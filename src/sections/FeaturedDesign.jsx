import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image1 from "../assets/FeaturedDesign/Image1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRocket,
  faPaintBrush,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const processSteps = [
  {
    icon: faRocket,
    title: "Start with an Inquiry",
    description:
      "Connect with us to share your agricultural product requirements. From grains to spices, we understand your needs and prepare the right solutions.",
  },
  {
    icon: faPaintBrush,
    title: "Processing & Packaging",
    description:
      "Our team ensures careful processing and secure packaging that preserves freshness, quality, and international standards.",
  },
  {
    icon: faCheckCircle,
    title: "Global Delivery",
    description:
      "We handle distribution and logistics to deliver your products safely and on time, wherever you are in the world.",
  },
];

// Reusable animation wrapper
const FadeIn = ({ children, delay = 0 }) => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Replay on scroll
    threshold: 0.2,
  });

  const variants = {
    hidden: {
      opacity: 0,
      y: 30, // Slide up from below
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

function ProcessMap() {
  return (
    <section className="p-6 md:p-10 lg:p-20 bg-white grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
      <div className="space-y-10">
        <FadeIn delay={0.2}>
          <h2 className="text-[#0094FF] font-1 font-semibold text-3xl md:text-4xl lg:text-5xl font-1 leading-tight">
            Bringing Agriculture to You in Three Simple Steps
          </h2>
        </FadeIn>
        {processSteps.map((step, index) => (
          <FadeIn key={index} delay={0.4 + index * 0.2}>
            <section className="flex justify-between gap-3 items-start md:items-center">
              <div className="flex flex-col items-center gap-3">
                <div>
                  <span className="rounded-full p-2 bg-[#1F1F1F]">
                    <FontAwesomeIcon icon={step.icon} className="text-white" />
                  </span>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="h-20 w-0.5 bg-[#9B9B9B]"></div>
                )}
              </div>
              <div>
                <h2 className="text-[#1F1F1F] font-bold font-1 text-lg">
                  {step.title}
                </h2>
                <p className="font-1 paragraph-1 text-[#545454]">
                  {step.description}
                </p>
              </div>
            </section>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={0.6}>
        <div>
          <img src={Image1} alt="Featured Design" />
        </div>
      </FadeIn>
    </section>
  );
}

export default ProcessMap;