import { HeartPulse, MapPin, Phone, Mail } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import logoPath from "@assets/ND India Logo-01 (1)_1749586357933.png";
import { useLocation } from "wouter";

export default function Footer() {
  const [, navigate] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={logoPath}
                alt="ND Diagnostics India Logo"
                className="h-20 w-auto"
              />
              <div>
                <p className="text-gray-400">Australia Visa Medical Centre</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-lg">
              Your trusted partner for Australia visa medical examinations.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate("/AppointmentBooking");
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 50);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Book Appointment
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin className="text-brand-orange h-4 w-4" />
                <span className="text-gray-400">
                  ND Diagnostics, 2nd Floor, Coastal Chambers,
                  Ravipuram,Ernakulam, Kerala 682016 India
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="text-brand-orange h-4 w-4" />
                <span className="text-gray-400">+91 9582-116116</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="text-brand-orange h-4 w-4" />
                <span className="text-gray-400">info@nddiagnostics.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              ©2025 ND Diagnostics India Private Limited. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
