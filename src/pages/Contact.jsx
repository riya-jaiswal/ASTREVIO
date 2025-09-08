import React, { useState } from "react";
import Navbar from "../sections/Navbar";
import Footer from "../sections/Footer";
import Hero from "../sections/Hero";
import Image1 from "../assets/Contact/Image1.png";
import Newsletter from "../sections/Newsletter";
import Mainlayout from "../layout/Mainlayout";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

function Contact() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post("/api/contactApi.js", data);

      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Message Sent",
          text: "We will get back to you shortly!",
        });
        reset();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong, please try again later!",
      });
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Mainlayout>
      <Hero />
      <motion.section
        ref={ref}
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="p-6 md:p-10 lg:p-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#1F1F1F] p-6 md:p-10">
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img src={Image1} className="h-full w-full" alt="Contact" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-white font-semibold text-5xl font-1 md:text-4xl lg:text-5xl leading-tight">
              Contact Us
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <input
                  className="bg-white text-[#939292] font-medium p-2 px-3 w-full outline-none font-1"
                  placeholder="Enter Your Name"
                  {...register("name", { required: "* Name is required" })}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <input
                  className="bg-white text-[#939292] font-medium p-2 px-3 w-full outline-none font-1"
                  placeholder="Enter Your Number"
                  {...register("phone", {
                    required: "* Phone number is required",
                    minLength: { value: 10, message: "Must be at least 10 digits" },
                  })}
                  disabled={loading}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <input
                  className="bg-white text-[#939292] p-2 px-3 font-medium w-full outline-none font-1"
                  placeholder="Enter Your Email"
                  {...register("email", {
                    required: "* Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div>
                <textarea
                  className="bg-white text-[#939292] p-2 font-medium px-3 w-full outline-none font-1"
                  placeholder="Enter Your Message"
                  rows={4}
                  {...register("message")}
                  disabled={loading}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm">{errors.message.message}</p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 py-2.5 px-6 text-base font-semibold font-1 transition ${
                    loading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-white text-[#1F1F1F] hover:bg-gray-200"
                  }`}
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-t-transparent border-[#1F1F1F] rounded-full animate-spin"></span>
                  )}
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.section>
      <Newsletter />
    </Mainlayout>
  );
}

export default Contact;
