import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import GradientBackground from "./components/GradientBackground";
import CustomCursor from "./components/CustomCursor";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Inquiry from "./pages/Inquiry";
import Links from "./pages/Links";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// opacity-only — a `y` here compiles to a transform on the wrapper that holds
// all page content, putting it on its own composite layer. The fixed navbar
// (a sibling) would then sample an empty backdrop and lose its blur in prod.
const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function App() {
  const location = useLocation();
  return (
    <>
      <GradientBackground />
      <CustomCursor />
      <Nav />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/links" element={<Links />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Footer />
    </>
  );
}
