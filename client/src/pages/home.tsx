import { motion } from "framer-motion";
import Hero from "@/components/hero";
import MissionVision from "@/components/mission-vision";
import Services from "@/components/services";
import About from "@/components/about";
import Process from "@/components/process";
import Documents from "@/components/documents";
import Contact from "@/components/contact";
import { ToastContainer } from "react-toastify";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Home() {
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <main>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
          className="min-h-screen py-20 px-4 sm:px-6 lg:px-8"
        >
          <Hero />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
          className="min-h-screen py-20 px-4 sm:px-6 lg:px-8"
        >
          <MissionVision />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
          className="min-h-screen py-20 px-4 sm:px-6 lg:px-8"
        >
          <Services />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
          className="min-h-screen py-20 px-4 sm:px-6 lg:px-8"
        >
          <About />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
          className="min-h-screen py-20 px-4 sm:px-6 lg:px-8"
        >
          <Process />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
          className="min-h-screen py-20 px-4 sm:px-6 lg:px-8"
        >
          <Documents />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
          className="min-h-screen py-20 px-4 sm:px-6 lg:px-8"
        >
          <Contact />
        </motion.div>
       
      </main>
    </motion.div>
  );
}
