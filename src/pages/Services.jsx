import React from "react";
import Navbar from "../sections/Navbar";
import Footer from "../sections/Footer";
import Testimonial from "../sections/Testimonial";
import FeatureDesign from "../sections/FeaturedDesign";
import Hero from "../sections/Hero";
import Image1 from "../assets/Services/Image1.png";
import Image2 from "../assets/Services/Image1.png";
import Image3 from "../assets/Services/Image1.png";
import Mainlayout from "../layout/Mainlayout";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

function Services() {
  const disp = useDispatch();

  const servicesData = [
    {
      img: Image1,
      title: "Lorem Ipsum",
      description: "Lorem Ipsum lorem ipsum",
      animation: { x: [-100, 0], opacity: [0, 1] }, // left → right
    },
    {
      img: Image2,
      title: "Lorem Ipsum",
      description: "Lorem Ipsum lorem ipsum",
      animation: { y: [100, 0], opacity: [0, 1] }, // bottom → top
    },
    {
      img: Image3,
      title: "Lorem Ipsum",
      description: "Lorem Ipsum lorem ipsum lorem ipsum lorem ipsum",
      animation: { y: [-100, 0], opacity: [0, 1] }, // top → bottom
    },
  ];

  return (
    <Mainlayout>
      <Hero />
      <section className="p-6 md:p-10 lg:p-20 space-y-6">
        <h2 className="flex gap-3 font-1 font-semibold text-3xl md:text-4xl lg:text-5xl items-center text-[#1F1F1F] font-1">
          <div className="w-24 h-[3px] bg-[#1F1F1F]"></div>Our Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {servicesData?.map((data, index) => {
            const { ref, inView } = useInView({
              triggerOnce: true,
              threshold: 0.2,
            });

            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0 }}
                animate={inView ? data.animation : { opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-[#1F1F1F] p-6 space-y-3"
              >
                <div>
                  <img src={data?.img} alt={data?.title} />
                </div>
                <h2 className="text-white font-semibold font-1">
                  {data?.title}
                </h2>
                <p className="text-[#939292] font-1 font-medium min-h-12">
                  {data?.description}
                </p>
                <div>
                  <button
                    onClick={() => {
                      disp({ type: "open" });
                    }}
                    className="bg-white px-6 py-3 text-[#1F1F1F] font-1 font-semibold hover:bg-[#F1F1F1] cursor-pointer"
                  >
                    Request a Service
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
      <FeatureDesign />
      <Testimonial />
    </Mainlayout>
  );
}

export default Services;
