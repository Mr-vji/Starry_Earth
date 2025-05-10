import { Scroll } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { StarrySky } from "./StarrySky";
import { Earth } from "./Earth";
import { Cursor } from "./Cursor";
import { useThree } from "@react-three/fiber";

export const Experience = () => {
   const { width, height } = useThree((state) => state.viewport);
   return (
      <>
         <StarrySky nbParticles={600} />
         <Cursor />
         <Scroll>
            <Earth position={[0, -height, 0]} />
         </Scroll>
         <EffectComposer>
            <Bloom intensity={0.8} luminanceThreshold={1} mipmapBlur />
         </EffectComposer>
      </>
   );
};
