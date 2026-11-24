import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"

import Model from "./Model/Model"
import "./Experience.css"

const MainLight = () => {
  return (
    <directionalLight
      position={[-242.7, -197.6, 42.4]}
      intensity={5}
      color="#ffffff"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-15}
      shadow-camera-right={15}
      shadow-camera-top={15}
      shadow-camera-bottom={-15}
      shadow-bias={-0.0001}
    >
      <object3D attach="target" position={[1.5, 0.6, -4.0]} />
    </directionalLight>
  )
}

const Experience = () => {
  return (
    <div className="experience-container">
      <Canvas
        camera={{
          position: [5, 4, 7],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <Environment
          preset="sunset"
          environmentRotation={[3.89, 0.67, -1.11]}
          environmentIntensity={1}
        />

        <ambientLight intensity={0.5} />
        {/* <MainLight /> */}

        
        <Model />
{/* 
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={30}
        /> */}
      </Canvas>
    </div>
  )
}

export default Experience