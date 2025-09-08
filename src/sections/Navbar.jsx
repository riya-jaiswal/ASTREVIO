import React, { useState } from "react";
import Logo from "../assets/logo/logo 3.png";
import { Link, useLocation } from "react-router-dom";
import { X, Menu } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <section className="hidden md:flex justify-between items-center py-4 px-12 sticky top-0 bg-[#87CEEB] z-[9999] shadow-md">
        <div>
          <img
            src={Logo}
            alt="Logo"
            className="h-12 transition-transform duration-300 hover:scale-105"
          />
        </div>
        <ul className="flex gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-lg font-medium transition-colors group duration-300 ${
                pathname === link.path
                  ? "text-white font-semibold"
                  : "text-white hover:opacity-80"
              }`}
            >
              {link.name}
              <span
                className={`absolute left-0 bottom-[-6px] h-1 rounded-sm bg-white transition-all duration-300 ${
                  pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </ul>
        <div>
          <a className="justify-center inline-flex text-white gap-3 items-center cursor-pointer text-base font-semibold transition-all duration-300">
            <FontAwesomeIcon
              icon={faPhone}
              fontSize={22}
              className="bg-white/20 text-white p-1 py-1.5 rounded"
            />{" "}
            +91 96 5261 236
          </a>
        </div>
      </section>

      {/* Mobile Navbar */}
      <section className="block md:hidden p-5 sticky top-0 shadow-md bg-[#87CEEB] z-[9999]">
        <div className="flex justify-between items-center">
          <img
            src={Logo}
            alt="Logo"
            className="h-14 transition-transform duration-300"
          />
          <button
            onClick={toggleMenu}
            className="p-2 rounded-xs bg-white/80 backdrop-blur-sm text-[#1F1F1F] hover:bg-white transition-all duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Dropdown Menu */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-3 bg-[#87CEEB] backdrop-blur-md p-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`w-full text-center py-3 rounded-xs text-lg font-medium transition-all duration-300 ${
                  pathname === link.path
                    ? "bg-white text-[#87CEEB] font-semibold"
                    : "text-white hover:bg-white/20 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="w-full flex justify-center mt-5">
              <button className="primary-button text-white border border-white px-4 py-2 rounded-md">
                96 5261 236
              </button>
            </div>
          </ul>
        </div>
      </section>
    </>
  );
}

export default Navbar;
