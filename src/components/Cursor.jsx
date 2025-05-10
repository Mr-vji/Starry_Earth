import { Trail } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const Cursor = () => {
   const t = useRef();
   const temPosition = new THREE.Vector3();
   const viewport = useThree((state) => state.viewport);
   const BloomColor = new THREE.Color("#ff6600");
   BloomColor.multiplyScalar(7);

   useFrame(({ pointer }, delta) => {
      if (t.current) {
         // Map pointer (-1 to 1) to viewport coordinates
         temPosition.set(
            pointer.x * (viewport.width / 2),
            pointer.y * (viewport.height / 2),
            0.0
         );
         t.current.position.lerp(temPosition, delta * 12);
      }
   });

   return (
      <>
         <Trail
            width={2} // Width of the line
            color={BloomColor} // Color of the line
            length={1} // Length of the line
            decay={1} // How fast the line fades away
            local={false} // Wether to use the target's world or local positions
            stride={0} // Min distance between previous and current point
            interval={1} // Number of frames to wait before next calculation
            target={t} // Optional target. This object will produce the trail.
         >
            {/* If `target` is not defined, Trail will use the first `Object3D` child as the target. */}
            <mesh visible={true} scale={0.1} ref={t}>
               <sphereGeometry />
               <meshBasicMaterial color={BloomColor} />
            </mesh>

            {/* You can optionally define a custom meshLineMaterial to use. */}
            {/* <meshLineMaterial color={"red"} /> */}
         </Trail>
      </>
   );
};
