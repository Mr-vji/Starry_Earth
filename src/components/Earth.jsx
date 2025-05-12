import {
   PresentationControls,
   shaderMaterial,
   useScroll,
   useTexture,
} from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { button, useControls } from "leva";
import { useRef, useState } from "react";
import * as THREE from "three";
import useStore from "./Store";

export const Earth = ({ ...props }) => {
   /* Zustand  */

   const PHI = useStore((state) => state.PHI);
   const THETA = useStore((state) => state.THETA);
   const phi3 = useStore((state) => state.phi3);

   let uTime = 0;

   const [c, setC] = useState(1.0);
   const mEarth = useRef();
   const debugsun = useRef();
   const earthMaterial = useRef();
   const sunColor = new THREE.Color(0xfff5cc);
   sunColor.multiplyScalar(9);

   /* Textures */
   const earthDayTexture = useTexture("../textures/day.jpg");
   earthDayTexture.colorSpace = THREE.SRGBColorSpace;
   earthDayTexture.anisotropy = 8;

   const earthNightTexture = useTexture("../textures/night.jpg");
   earthNightTexture.colorSpace = THREE.SRGBColorSpace;
   earthNightTexture.anisotropy = 8;

   const earthSpecularCloudsTexture = useTexture(
      "../textures/specularClouds.jpg"
   );
   earthSpecularCloudsTexture.anisotropy = 8;

   /* Leva  */
   const { Phi, Theta, Clouds, AtmosphereDayColor, AtmosphereTwilightColor } =
      useControls({
         Phi: { value: 1.54, min: -Math.PI, max: Math.PI },
         Theta: { value: -1.34, min: -Math.PI, max: Math.PI },
         Clouds: { value: 0.2, min: 0.0, max: 0.6 },
         "Show clouds at night ?": button(() => {
            setC((prev) => (prev ? 1.0 : prev(0.0)));
         }),

         AtmosphereDayColor: {
            value: "#00aaff",
            label: "Atmosphere Day Color",
         },
         AtmosphereTwilightColor: {
            value: "#ff6600",
            label: "Atmosphere Twilight Color",
         },
      });

   const sunSpherical = new THREE.Spherical(1, PHI, THETA);
   const sunDirection = new THREE.Vector3();

   const updateSun = () => {
      sunDirection.setFromSpherical(sunSpherical);
      debugsun.current.position.copy(sunDirection).multiplyScalar(10);

      earthMaterial.current.uSunDirection.copy(sunDirection);
   };

   const scrollData = useScroll();

   /* UseFrame to animate... */
   useFrame((_, delta) => {
      uTime = delta;

      updateSun();

      // mEarth.current.rotation.y = scrollData.offset * Math.PI;
      mEarth.current.rotation.y += uTime * 0.1;
   });

   return (
      <>
         <group {...props}>
            <PresentationControls>
               <mesh ref={mEarth} scale={1}>
                  <sphereGeometry args={[6, 32 * 2, 32 * 2]} />
                  <eshader
                     ref={earthMaterial}
                     uDayTexture={earthDayTexture}
                     uNightTexture={earthNightTexture}
                     uSpecularCloudsTexture={earthSpecularCloudsTexture}
                     uSunDirection={new THREE.Vector3(0, 0, 1)}
                     uClouds={phi3}
                     uCloudsShow={c}
                     uAtmosphereDayColor={new THREE.Color(AtmosphereDayColor)}
                     uAtmosphereTwilightColor={
                        new THREE.Color(AtmosphereTwilightColor)
                     }
                  />
               </mesh>
            </PresentationControls>
            <mesh scale={0.2} ref={debugsun}>
               <icosahedronGeometry args={[1, 2]} />
               <meshBasicMaterial color={sunColor} />
            </mesh>
         </group>
      </>
   );
};

const Eshader = shaderMaterial(
   //_______________________________________________________
   {
      uDayTexture: null,
      uNightTexture: null,
      uSpecularCloudsTexture: null,
      uSunDirection: null,
      uClouds: null,
      uAtmosphereDayColor: null,
      uAtmosphereTwilightColor: null,
   },

   //_______________________vertex________________________________
   /* glsl */ `
   
   varying vec2 vUv;
   varying vec3 vNormal;
   varying vec3 vPosition ;

   void main () {

    //position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    
    //varyings
    vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
    
   }`,
   //________________________fragment_______________________________
   /* glsl */ `
   varying vec2 vUv;
   varying vec3 vNormal;
   varying vec3 vPosition;

   uniform sampler2D uDayTexture;
   uniform sampler2D uNightTexture;
   uniform sampler2D uSpecularCloudsTexture;
   uniform vec3 uSunDirection;
   uniform float uClouds;
   uniform float uCloudsShow;
   uniform vec3 uAtmosphereDayColor;
   uniform vec3 uAtmosphereTwilightColor;

   void main () {

    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    // Sun Orientation
    float sunOrientation = dot(uSunDirection, normal);

    // Day / night color
    float dayMix = smoothstep( -0.25, 0.5, sunOrientation);
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;
    color = mix(nightColor, dayColor, dayMix);

    // Specular Clouds Color
    vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;
    
   //clouds
      float cloudsMix = smoothstep(uClouds, 1.0, specularCloudsColor).g;
      cloudsMix *= dayMix + uCloudsShow;
      color = mix(color, vec3(1.0), cloudsMix);

      //Fresnel
      float fresnel = dot(viewDirection, normal) + 1.0;
      fresnel = pow(fresnel, 3.0);
      
      // Atmoshpere Color
      float atmosphereDayMix = smoothstep(- 0.5, 1.0, sunOrientation);
      vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
      color = mix(color, atmosphereColor, fresnel * atmosphereDayMix);

      //sepular
      vec3 reflection = reflect(- uSunDirection, normal);
      float specular = - dot(reflection, viewDirection);
      specular = max(specular, 0.0);
      specular = pow(specular, 32.0);
      specular *= specularCloudsColor.r;

      vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel);
      color += specular * specularColor;


    gl_FragColor = vec4(color, 1.0);
    
   }`
);

extend({ Eshader });

// Preload the textures
useTexture.preload("../textures/day.jpg");
useTexture.preload("../textures/night.jpg");
useTexture.preload("../textures/specularClouds.jpg");
