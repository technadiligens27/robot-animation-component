import { useEffect, useMemo, useState } from "react"
import { Float, useAnimations, useGLTF } from "@react-three/drei"
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing"

import { useAnimationContext } from "../../Context/AnimationContext"

const modelPath = `${import.meta.env.BASE_URL}fun-robot.glb`
const mobileQuery = "(max-width: 768px)"

const glowMaterialName = "Material.005"
const glowColor = "#00e5ff"
const glowIntensity = 4
const bloomLights = []

const Model = () => {
  const { setRobotActions } = useAnimationContext()

  const [isMobile, setIsMobile] = useState(() => window.matchMedia(mobileQuery).matches)

  const { scene, animations } = useGLTF(modelPath)
  const { actions } = useAnimations(animations, scene)

  const glowMeshes = useMemo(() => {
    const meshes = []

    scene.traverse((object) => {
      if (!object.isMesh) return

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      if (
        materials.length > 0 &&
        materials.every((material) => material?.name === glowMaterialName)
      ) {
        meshes.push(object)
      }
    })

    return meshes
  }, [scene])

  useEffect(() => {
    const mediaQuery = window.matchMedia(mobileQuery)

    const handleChange = (event) => {
      setIsMobile(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  useEffect(() => {
    setRobotActions(actions)

    return () => {
      setRobotActions(null)
    }
  }, [actions, setRobotActions])

  useEffect(() => {
    const glowMaterials = new Set(glowMeshes.flatMap((mesh) => mesh.material))
    const originalSettings = []

    for (const material of glowMaterials) {
      if (!material.emissive) continue

      originalSettings.push({
        material,
        color: material.emissive.clone(),
        intensity: material.emissiveIntensity,
        toneMapped: material.toneMapped,
      })

      material.emissive.set(glowColor)
      material.emissiveIntensity = glowIntensity
      material.toneMapped = false
      material.needsUpdate = true
    }

    return () => {
      for (const { material, color, intensity, toneMapped } of originalSettings) {
        material.emissive.copy(color)
        material.emissiveIntensity = intensity
        material.toneMapped = toneMapped
        material.needsUpdate = true
      }
    }
  }, [glowMeshes])

  return (
    <>
      <group position={[isMobile ? -0.22 : -0.44, -0.82, 0.52]}>
          <Float
          speed={3}
          floatIntensity={1.3}
          rotationIntensity={0.2}
          floatingRange={[-0.1, 0.1]}
        >
          <group
            rotation={[-0.38, 0.35, 0.08, "YXZ"]}
            scale={isMobile ? 0.8 : 1.11}
          >
            <primitive object={scene} />
          </group>
        </Float>
      </group>

      {glowMeshes.length > 0 && (
        <EffectComposer>
          <SelectiveBloom
            selection={glowMeshes}
            lights={bloomLights}
            ignoreBackground
            mipmapBlur
            luminanceThreshold={1}
            intensity={0.8}
          />
        </EffectComposer>
      )}
    </>
  )
}

useGLTF.preload(modelPath)

export default Model