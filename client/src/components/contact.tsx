import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-16 gradient-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-brand-teal/5 via-brand-orange/5 to-brand-purple/5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-brand-black">Contact Us</span><br/>
            <span className="text-brand-orange">Today</span>
          </h2>
          <p className="text-xl text-brand-black max-w-3xl mx-auto">
            Ready to begin your Australia visa medical examination? Get in touch with our professional team for scheduling and information.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="glass-effect p-8 rounded-2xl shadow-lg border border-white/20">
              <h3 className="text-2xl font-bold text-brand-black mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 card-gradient-orange rounded-xl flex items-center justify-center flex-shrink-0 shadow-neon-orange group-hover:scale-110 group-hover:animate-rainbow transition-transform">
                    <MapPin className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-orange transition-colors">Location</h4>
                    <p className="text-gray-600">ND Diagnostics India Pvt. Ltd.<br />Corporation Door No. 61/2145 C1,<br />CUC Ventures Coastal Chambers,<br />M.G. Road
                      Kochi,Ernakulam, <br />Kerala – 682015<br /> India</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 card-gradient-blue rounded-xl flex items-center justify-center flex-shrink-0 shadow-neon-blue group-hover:scale-110 group-hover:animate-rainbow transition-transform">
                    <Phone className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-blue transition-colors">Phone</h4>
                    <p className="text-gray-600">+91 9582-116116</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 card-gradient-green rounded-xl flex items-center justify-center flex-shrink-0 shadow-neon-green group-hover:scale-110 group-hover:animate-rainbow transition-transform">
                    <Mail className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-green transition-colors">Clinic Email</h4>
                    <p className="text-gray-600">cm@ndhealthcareservices.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 card-gradient-purple rounded-xl flex items-center justify-center flex-shrink-0 shadow-neon-purple group-hover:scale-110 group-hover:animate-rainbow transition-transform">
                    <Clock className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-purple transition-colors">Operating Hours</h4>
                    <p className="text-gray-600">Monday - Saturday: 9:00 AM - 5:00 PM<br />Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="glass-effect p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-brand-black mb-2">Find Us on the Map</h3>
                <p className="text-lg text-brand-black">Located in the heart of Kochi for your convenience</p>
              </div>
              
              <div className="relative w-full h-96 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.8918469774244!2d76.2673!3d9.9312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d01c8f1c0c1%3A0x6c5e7b0f8f2b4d5e!2sMarine%20Drive%2C%20Kochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ND Diagnostics India Location Map"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}