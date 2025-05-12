import { Html, Loader, Scroll, ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { UX } from "./components/UX";

function App() {
   return (
      <>
         <Leva collapsed={true} hidden />
         <Loader />
         <Canvas shadows camera={{ position: [0, 0, 20], fov: 50 }}>
            {/* <color attach="background" args={["#131017"]} /> */}
            <color attach="background" args={["black"]} />
            {/* <Experience /> */}

            <ScrollControls pages={2} damping={0.8}>
               <Experience />
               <Scroll html>
                  <UX />
               </Scroll>
            </ScrollControls>
         </Canvas>
      </>
   );
}

export default App;
