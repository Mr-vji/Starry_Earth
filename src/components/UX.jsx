import { motion } from "framer-motion";
import useStore from "./Store";
import { useScroll } from "@react-three/drei";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export const UX = () => {
   /* Use - state  */
   const PHI = useStore((state) => state.PHI);
   const setPHI = useStore((state) => state.setPHI);

   const THETA = useStore((state) => state.THETA);
   const setTHETA = useStore((state) => state.setTHETA);

   const phi3 = useStore((state) => state.phi3);
   const setPhi3 = useStore((state) => state.setPhi3);

   const scroll = useScroll();
   const ref = useRef();
   const [xPos, setXPos] = useState(-500);

   useFrame(() => {
      // scroll.offset is a value from 0 to 1

      const x = -800 + scroll.offset * 800;
      setXPos(x);
   });

   return (
      <main className="w-screen">
         <Section className="flex flex-col -mt-20 items-center justify-center">
            <h1
               className=" text-4xl md:text-8xl font-light text-center text-transparent
                  bg-clip-text bg-gradient-to-r  from-gray-100/50 via-white to-gray-100/50 drop-shadow-sm"
            >
               Welcome to the Starry Earth Scene
            </h1>
            <p className="text-center text-white/90 mt-10 text-sm opacity-0">
               A stunning visual experience of Earth and the stars, crafted with
               care by YESCA. 🌍✨{" "}
            </p>
         </Section>

         {/* ________________________________________________________________________________ */}

         {/* __________________________________________________________________________________________________ */}

         <motion.div
            className="flex mt-20 h-screen items-center justify-start px-6 md:px-20 py-20"
            style={{
               x: xPos,
               position: "relative",
               top: 0,
               left: 0,
               width: "100%",
            }}
         >
            {/* Card */}
            <div className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl w-full sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 text-white">
               <p className="mb-2 text-sm sm:text-base">
                  Hello! We're Listening
               </p>
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-gray-100/50 via-white to-gray-100/50 drop-shadow-sm">
                  Let's talk about your project
               </h1>
               <p className="text-white/90 mt-6 text-xs sm:text-sm">
                  A stunning visual experience of Earth and the stars, crafted
                  with care by YESCA. 🌍✨
               </p>

               {/* Seek Bar 1 */}
               <label
                  htmlFor="PHI-range"
                  className="block mt-6 mb-2 text-sm font-medium text-white"
               >
                  PHI Rotation
               </label>
               <input
                  id="PHI-range"
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step={0.001}
                  value={PHI}
                  onChange={(e) => setPHI(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  style={{
                     background: `linear-gradient(to right, #ff6600 ${
                        ((PHI + Math.PI) / (2 * Math.PI)) * 100
                     }%, #ccc 0%)`,
                  }}
               />

               {/* Seek Bar 2 */}
               <label
                  htmlFor="THETA-range"
                  className="block mt-6 mb-2 text-sm font-medium text-white"
               >
                  Theta Angle
               </label>
               <input
                  id="THETA-range"
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step={0.001}
                  value={THETA}
                  onChange={(e) => setTHETA(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  style={{
                     background: `linear-gradient(to right, #ff6600 ${
                        ((THETA + Math.PI) / (2 * Math.PI)) * 100
                     }%, #ccc 0%)`,
                  }}
               />

               {/* Seek Bar 3 */}
               <label
                  htmlFor="phi3-range"
                  className="block mt-6 mb-2 text-sm font-medium text-white"
               >
                  Cloud Density Control
               </label>
               <input
                  id="phi3-range"
                  type="range"
                  min="0.0"
                  max="0.6"
                  step={0.001}
                  value={phi3}
                  onChange={(e) => setPhi3(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  style={{
                     background: `linear-gradient(to right, #ff6600 ${
                        ((phi3 - 0.0) / (0.6 - 0.0)) * 100
                     }%, #ccc 0%)`,
                  }}
               />

               <button
                  onClick={() =>
                     window.open("https://yesca.in/contact/", "_blank")
                  }
                  className="w-full mt-8 px-6 py-3 bg-white text-black rounded-full text-sm hover:bg-white/30 hover:text-white transition-colors duration-300"
               >
                  SOUND GOOD? LET'S CONNECT!
               </button>
            </div>
         </motion.div>
      </main>
   );
};

const Section = ({ children, className = "" }) => {
   return (
      <section
         className={`max-w-[1024px] mx-auto h-screen - p-10 ${className}`}
      >
         {children}
      </section>
   );
};
