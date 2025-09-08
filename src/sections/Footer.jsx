import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo/Logo1.png";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

function Footer() {
  const [loading, setLoading] = useState(false); // 🔹 Loader state

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Submit handler
  const onSubmit = async (data) => {
    if (loading) return; // 🔹 Prevent double submit
    setLoading(true);

    try {
      const res = await axios.post("/api/emailSubscribingApi.js", data);

      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Subscribed Successfully!",
          text: "Thank you for subscribing to our newsletter.",
        });
        reset();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Subscription Failed",
        text: "Something went wrong, please try again later.",
      });
    } finally {
      setLoading(false); // 🔹 Reset loader
    }
  };

  return (
    <section className="relative">
      {/* Input box overlapping footer */}
      <section className="w-full -top-8 flex justify-center items-center md:absolute">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center max-w-full p-1.5 md:w-xl bg-white shadow-md border border-gray-300"
        >
          <FontAwesomeIcon
            icon={faEnvelope}
            className="text-gray-400 ml-3"
            fontSize={20}
          />
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "* Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            className="flex-1 px-4 py-3 text-gray-700 outline-none border-none"
            disabled={loading} // 🔹 Disable input while submitting
          />
          <button
            type="submit"
            disabled={loading} // 🔹 Prevent click while loading
            className={`py-2.5 px-6 text-base font-1 transition-all duration-300 font-semibold 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#1F1F1F] hover:bg-[#F1F1F1] hover:text-[#1f1f1f] text-white"}
            `}
          >
            {loading ? "Submitting..." : "Subscribe"}
          </button>
        </form>
      </section>

      {/* Validation error */}
      {errors.email && (
        <p className="text-red-500 text-sm text-center mt-2">
          {errors.email.message}
        </p>
      )}

      {/* Footer main */}
      <footer className="flex flex-col md:flex-row gap-10 p-6 md:p-10 lg:p-20 bg-[#1F1F1F]">
        <div className="space-y-6 flex-3">
          <img src={Logo} alt="Logo" />
          <p className="text-[#D1D1D1] max-w-xs">
            Abtik digital your premier destination for luxury and modern
            interior design
          </p>
          <div className="flex gap-2">
            <button className="bg-[#313131] p-1 cursor-pointer">
              <FontAwesomeIcon icon={faFacebook} fontSize={22} className="text-white" />
            </button>
            <button className="bg-[#313131] p-1 cursor-pointer">
              <FontAwesomeIcon icon={faInstagram} fontSize={22} className="text-white" />
            </button>
            <button className="bg-[#313131] p-1 cursor-pointer">
              <FontAwesomeIcon icon={faLinkedin} fontSize={22} className="text-white" />
            </button>
            <button className="bg-[#313131] p-1 cursor-pointer">
              <FontAwesomeIcon icon={faTwitter} fontSize={22} className="text-white" />
            </button>
          </div>
        </div>

        <div className="space-y-3 flex-2">
          <h2 className="text-white text-xl font-semibold font-1">Our Company</h2>
          <div className="space-y-2">
            <Link
              className="block hover:text-gray-400 text-[#D1D1D1] font-1 text-base transition-all duration-300 hover:underline"
              to={"/"}
            >
              Home
            </Link>
            <Link
              className="block hover:text-gray-400 text-[#D1D1D1] font-1 text-base transition-all duration-300 hover:underline"
              to={"/"}
            >
              About
            </Link>
            <Link
              className="block hover:text-gray-400 text-[#D1D1D1] font-1 text-base transition-all duration-300 hover:underline"
              to={"/"}
            >
              Services
            </Link>
            <Link
              className="block hover:text-gray-400 text-[#D1D1D1] font-1 text-base transition-all duration-300 hover:underline"
              to={"/"}
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <h2 className="text-xl font-1 font-semibold text-white">Contact </h2>
          <div className="space-y-3">
            <a className="text-[#D1D1D1] transition-all duration-300 hover:underline cursor-pointer hover:text-gray-400 font-1 text-base block">
              abc@.com
            </a>
            <a className="text-[#D1D1D1] transition-all duration-300 hover:underline cursor-pointer hover:text-gray-400 font-1 text-base block">
              +91 00 000 000
            </a>
            <a className="text-[#D1D1D1] transition-all duration-300 hover:underline cursor-pointer hover:text-gray-400 font-1 text-base block">
              Design Avenue Cityville, CA 90210 United States
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}

export default Footer;
