/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle2, 
  Waves, 
  PartyPopper, 
  Utensils, 
  ShieldCheck, 
  ChevronRight,
  Menu,
  X,
  Instagram,
  Facebook,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BUSINESS_DETAILS = {
  name: "Ganga Farms",
  tagline: "A Well-Designed Wedding Venue & Luxury Farmhouse",
  address: "bus stop, Medchal - Ghanpur - Shamirpet Rd, before, Pudur, Telangana 501401",
  phone: "97050 50403",
  whatsapp: "97050 50403",
  mapsLink: "https://maps.app.goo.gl/XwVq3spkRM8tXJRC9",
  hours: "Every day 10 AM to 2 PM the next day (24 Hours)",
};

const SERVICES = [
  {
    title: "Stay & Comfort",
    icon: <ShieldCheck className="w-6 h-6" />,
    items: ["3 AC Bedrooms", "2 Furnished Living Hall", "Equipped Kitchen", "Power Backup", "Hot Water"]
  },
  {
    title: "Outdoor & Recreation",
    icon: <Waves className="w-6 h-6" />,
    items: ["Private Swimming Pool", "Large Green Lawns", "Cricket & Badminton", "BBQ & Bonfire", "Kids Play Area"]
  },
  {
    title: "Events & Parties",
    icon: <PartyPopper className="w-6 h-6" />,
    items: ["Weddings", "Corporate Outings", "Birthday Parties", "Projector & Music System", "Custom Decoration"]
  },
  {
    title: "Food & Catering",
    icon: <Utensils className="w-6 h-6" />,
    items: ["Self-Cooking Allowed", "Local Vendor Tie-ups", "BBQ Arrangements"]
  }
];

const TESTIMONIALS = [
  {
    name: "Srujan Kumar",
    text: "Very decent and cozy place to spend time with family and friends.",
    rating: 5
  },
  {
    name: "Rakesh",
    text: "We have enjoyed a lot it's was good atmosphere guided by eshwar",
    rating: 5
  },
  {
    name: "Raj Ani",
    text: "The overall vibe is great, perfect for weekend getaways.",
    rating: 4
  }
];

const FAQ = [
  {
    question: "What are the check-in and check-out times?",
    answer: "We operate on a 24-hour cycle from 10 AM to 2 PM the next day."
  },
  {
    question: "Is self-cooking allowed?",
    answer: "Yes, we provide a fully equipped kitchen or kitchenette for guests who prefer to cook their own meals."
  },
  {
    question: "Is the property pet-friendly?",
    answer: "Yes, we are a pet-friendly property. Please inform us in advance if you are bringing your pets."
  }
];

const GALLERY_IMAGES = [
  "1-dQRsXANhpctZsCJxF9wHHhPZZAXUHYO",
  "10fawj45s4uOz60noTrXmWgjsJe8mFf9z",
  "14GUNcv0Vqs11YzQP5iyG5hmrQmrytB1s",
  "1COCZWV4j_eZkoe7htXgzy2zVyWoAstlt",
  "1GPpjcw3H4UWc-roD4EViSro-Odk6Couv",
  "1JfeMJpHlVYIP70aazrOW-J44umFCt4W0",
  "1LsmtE_RKLNhNreC2tjTSHISrzws-9bnZ",
  "1TNjlTKAtOaXTmOz3vLvrjboPPplP7UjB",
  "1YYmnvZKMNNMsFn5XrDUl82Hen4kJyBS1",
  "1pUC8_5MSOUvCPkKAXYLAqOCdMWLDHO9f",
  "1qBOJEL3GPYELKSG4-IF5DPxNpAxeI5yy",
  "1xdL1NsRE9h_oUMft2ILEKF7brAbD8qBp"
].map(id => `https://lh3.googleusercontent.com/d/${id}`);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-accent selection:text-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-lg py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/d/1bs7kqsoFMPAM8xYuicupyocOTvKOkLRh" 
                alt="Ganga Farms Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className={`text-2xl font-serif font-bold tracking-tight ${scrolled ? 'text-primary' : 'text-white'}`}>
              Ganga Farms
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Services', 'About', 'Gallery', 'Testimonials', 'Location'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`text-sm font-medium hover:text-accent transition-colors ${scrolled ? 'text-primary' : 'text-white'}`}
              >
                {item}
              </button>
            ))}
            <a
              href={`tel:${BUSINESS_DETAILS.phone}`}
              className="bg-primary text-secondary px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all shadow-lg flex items-center gap-2"
            >
              <Phone size={16} />
              Call Now
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`md:hidden p-2 ${scrolled ? 'text-primary' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              {['Services', 'About', 'Gallery', 'Testimonials', 'Location'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-2xl font-serif text-primary"
                >
                  {item}
                </button>
              ))}
              <div className="flex flex-col gap-4 mt-8">
                <a
                  href={`tel:${BUSINESS_DETAILS.phone}`}
                  className="bg-primary text-secondary py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Phone size={20} />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${BUSINESS_DETAILS.whatsapp.replace(/\s/g, '')}`}
                  className="bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/d/1Ha5yGs-UtuBeq9ZUWNYEHD6rxTUSrjix"
            alt="Ganga Farms Hero"
            className="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-primary/80" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 bg-accent/20 backdrop-blur-md border border-accent/30 rounded-full text-secondary text-sm font-semibold mb-6 tracking-wider uppercase">
              Premium Event Venue & Stay
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white font-bold mb-8 leading-tight">
              Celebrate Life's <br />
              <span className="italic text-secondary">Finest Moments</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience the perfect blend of luxury and nature at Ganga Farms. 
              From dream weddings to cozy family getaways, we provide the ultimate backdrop for your memories.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`tel:${BUSINESS_DETAILS.phone}`}
                className="w-full sm:w-auto bg-secondary text-primary px-10 py-5 rounded-full font-bold text-lg shadow-2xl flex items-center justify-center gap-2 group"
              >
                <Phone size={20} className="group-hover:rotate-12 transition-transform" />
                Call Now
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('services')}
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                View Services
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Floating Trust Badge */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 text-white/80 text-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-accent" />
            <span>24/7 Service</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-accent" />
            <span>Medchal, Telangana</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-accent font-bold tracking-widest uppercase text-sm mb-4">Our Offerings</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-primary font-bold mb-6">
              Everything You Need for a Perfect Celebration
            </h3>
            <div className="w-20 h-1.5 bg-accent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-[#faf9f6] hover:bg-primary transition-all duration-500 border border-gray-100 shadow-sm hover:shadow-2xl"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-accent group-hover:text-white transition-colors shadow-sm">
                  {service.icon}
                </div>
                <h4 className="text-xl font-serif font-bold text-primary mb-4 group-hover:text-white transition-colors">
                  {service.title}
                </h4>
                <ul className="space-y-3">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-600 group-hover:text-gray-300 text-sm transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
              <img
                src="https://lh3.googleusercontent.com/d/1xdL1NsRE9h_oUMft2ILEKF7brAbD8qBp"
                alt="Ganga Farms Property"
                className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-accent font-bold tracking-widest uppercase text-sm mb-4">The Ganga Experience</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-primary font-bold mb-8 leading-tight">
              A Sanctuary of <br />Peace and Celebration
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Ganga Farms is more than just a venue; it's a destination where luxury meets the rustic charm of nature. 
              Located conveniently near Pudur, our property is designed to host everything from grand pre-wedding 
              celebrations to intimate family gatherings.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h4 className="text-3xl font-serif font-bold text-primary mb-2">24/7</h4>
                <p className="text-gray-500 text-sm uppercase tracking-wider">Availability</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-primary mb-2">100%</h4>
                <p className="text-gray-500 text-sm uppercase tracking-wider">Private Space</p>
              </div>
            </div>
            <a 
              href={`https://wa.me/${BUSINESS_DETAILS.whatsapp.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-3 text-primary font-bold group"
            >
              Learn more about our packages
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-accent font-bold tracking-widest uppercase text-sm mb-4">Visual Tour</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-primary font-bold mb-6">Experience the Beauty</h3>
            <div className="w-20 h-1.5 bg-accent mx-auto rounded-full" />
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {GALLERY_IMAGES.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500"
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img}
                  alt={`Ganga Farms Gallery ${idx + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-50 group-hover:scale-100 transition-transform duration-500">
                    <ArrowRight className="-rotate-45" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors p-2"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Gallery Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Why Choose Us */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-accent font-bold tracking-widest uppercase text-sm mb-4">Why Ganga Farms?</h2>
              <h3 className="text-4xl font-serif font-bold mb-6">Unmatched Hospitality & Facilities</h3>
              <p className="text-gray-400 mb-8">
                We take pride in offering a professional and warm service that ensures every guest feels at home.
              </p>
              <a
                href={`tel:${BUSINESS_DETAILS.phone}`}
                className="bg-secondary text-primary px-8 py-4 rounded-full font-bold inline-block hover:bg-white transition-colors"
              >
                Book Your Visit
              </a>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "Gated Security", desc: "Security guard on-site and gated property for complete peace of mind." },
                { title: "Ample Parking", desc: "Spacious parking area capable of accommodating multiple vehicles." },
                { title: "On-Site Staff", desc: "Dedicated caretaker and staff available to assist you throughout your stay." },
                { title: "Pet Friendly", desc: "Bring your furry friends along to enjoy the vast green lawns." }
              ].map((item) => (
                <div key={item.title} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <CheckCircle2 className="text-accent mb-4 w-8 h-8" />
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-accent font-bold tracking-widest uppercase text-sm mb-4">Guest Reviews</h2>
            <h3 className="text-4xl font-serif text-primary font-bold">What Our Visitors Say</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-[#faf9f6] border border-gray-100 relative"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold">
                    {t.name[0]}
                  </div>
                  <span className="font-bold text-primary">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://www.google.com/travel/search?q=ganga%20farms&g2lb=4965990%2C72471280%2C72560029%2C72573224%2C72647020%2C72686036%2C72803964%2C72882230%2C72958624%2C73059275%2C73064764&hl=en-IN&gl=in&ssta=1&ts=CAEaKwopEicyJTB4M2JjYjg2ODgzZmE3M2U5OToweDcwNTUxZGQ2YWQzZGJhMTU&qs=CAEyE0Nnb0lsZlQyNmVxNng2cHdFQUU4Ag&ap=ugEHcmV2aWV3cw&ictx=111&ved=0CAAQ5JsGahcKEwiQ9_LP5tOTAxUAAAAAHQAAAAAQCw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border-2 border-primary text-primary px-8 py-4 rounded-full font-bold hover:bg-primary hover:text-white transition-all shadow-md group"
            >
              View More Reviews
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section id="location" className="py-24 bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-accent font-bold tracking-widest uppercase text-sm mb-4">Find Us</h2>
              <h3 className="text-4xl font-serif text-primary font-bold mb-8">Visit Our Farmhouse</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                    <MapPin />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">Address</h4>
                    <p className="text-gray-600 leading-relaxed">{BUSINESS_DETAILS.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                    <Clock />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">Opening Hours</h4>
                    <p className="text-gray-600">Every day 10 AM to 2 PM the next day (24 Hours)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                    <Phone />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">Contact</h4>
                    <p className="text-gray-600">{BUSINESS_DETAILS.phone.replace(/\s/g, '').replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}</p>
                    <p className="text-gray-600">WhatsApp:</p>
                    <p className="text-gray-600">{BUSINESS_DETAILS.whatsapp.replace(/\s/g, '').replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}</p>
                  </div>
                </div>
              </div>
              <div className="mt-12 flex gap-4">
                <a
                  href={`tel:${BUSINESS_DETAILS.phone}`}
                  className="bg-primary text-secondary px-8 py-4 rounded-full font-bold shadow-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
                >
                  <Phone size={20} />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${BUSINESS_DETAILS.whatsapp.replace(/\s/g, '')}`}
                  className="bg-green-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
                >
                  <MessageCircle size={20} />
                  WhatsApp
                </a>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="h-[500px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <iframe
                  title="Ganga Farms Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3801.866504221768!2d78.50476!3d17.656453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb83f000000001%3A0x70551dd6ad3dba15!2sGanga%20Farms!5e0!3m2!1sen!2sin!4v1712750924000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              <div className="mt-6 text-center">
                <a 
                  href={BUSINESS_DETAILS.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent font-bold hover:underline inline-flex items-center gap-2"
                >
                  Open in Google Maps
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-accent font-bold tracking-widest uppercase text-sm mb-4">Common Questions</h2>
            <h3 className="text-4xl font-serif text-primary font-bold">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-6">
            {FAQ.map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-[#faf9f6] border border-gray-100">
                <h4 className="text-lg font-bold text-primary mb-3">{item.question}</h4>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-16 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1bs7kqsoFMPAM8xYuicupyocOTvKOkLRh" 
                    alt="Ganga Farms Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-2xl font-serif font-bold tracking-tight">
                  Ganga Farms
                </span>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Your premier destination for weddings, celebrations, and luxury farmhouse stays in Medchal. 
                Experience nature and luxury like never before.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-accent">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">Services</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection('gallery')} className="hover:text-white transition-colors">Gallery</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-white transition-colors">Reviews</button></li>
                <li><button onClick={() => scrollToSection('location')} className="hover:text-white transition-colors">Location</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-accent">Follow Us</h4>
              <div className="flex gap-4">
                <a 
                  href="https://www.instagram.com/gangafarms?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://www.facebook.com/GangaFarms1/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 flex flex-col md:row justify-between items-center gap-6 text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Ganga Farms. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons (Mobile) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50 md:hidden">
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href={`https://wa.me/${BUSINESS_DETAILS.whatsapp.replace(/\s/g, '')}`}
          className="w-14 h-14 bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center"
        >
          <MessageCircle size={24} />
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href={`tel:${BUSINESS_DETAILS.phone}`}
          className="w-14 h-14 bg-primary text-secondary rounded-full shadow-2xl flex items-center justify-center"
        >
          <Phone size={24} />
        </motion.a>
      </div>
    </div>
  );
}
