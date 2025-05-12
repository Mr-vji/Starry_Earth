import { Scroll, Text, useScroll } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { StarrySky } from "./StarrySky";
import { Earth } from "./Earth";
import { Cursor } from "./Cursor";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const Experience = () => {
   const { width, height } = useThree((state) => state.viewport);
   const earth = useRef();
   const scrollData = useScroll();

   const BLOOM_COLOR = new THREE.Color("#ff6600");
   BLOOM_COLOR.multiplyScalar(8);

   const BLOOM_WHITE = new THREE.Color("white");
   BLOOM_WHITE.multiplyScalar(1.2);

   useFrame((_, delta) => {
      // Scroll progress (0 to 1)
      const scroll = scrollData.scroll.current;

      // Target scale
      const targetScale = 1.6 - scroll * 0.6;
      const currentScale = earth.current.scale.x;
      const smoothScale = currentScale + (targetScale - currentScale) * 0.1;
      earth.current.scale.set(smoothScale, smoothScale, smoothScale);

      // === Smooth position ===
      const position = -height / 2 - 2;
      const setPosition = height / 2 - 2;

      const targetY = position - scroll * setPosition;
      const currentY = earth.current.position.y;
      const smoothY = currentY + (targetY - currentY) * 0.3;
      earth.current.position.y = smoothY;

      // === Smooth X position ===
      const defaultPositinX = 0;
      const targetPositionX = -7;

      const targetX = defaultPositinX - scroll * targetPositionX; //seting the position but not now

      const currentX = earth.current.position.x;
      const smoothX = currentX + (targetX - currentX) * 0.1; // animation start
      earth.current.position.x = smoothX; // applying
   });

   return (
      <>
         <StarrySky nbParticles={600} />
         <Cursor />
         <Scroll>
            <Earth position={[0, 0, 0]} ref={earth} />
            <Text
               font="../InterTight-Thin.ttf"
               position={[0, -0.8, 0]}
               textAlign="center"
               color={BLOOM_COLOR}
               scale={0.48}
            >
               A stunning visual experience of Earth and the stars, crafted with
               care by YESCA. ✨
            </Text>
         </Scroll>
         <EffectComposer>
            <Bloom intensity={0.8} luminanceThreshold={1} mipmapBlur />
         </EffectComposer>
      </>
   );
};
