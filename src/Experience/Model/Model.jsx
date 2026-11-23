import { useEffect, useState } from "react"
import { useAnimations, useGLTF } from "@react-three/drei"
import { useControls } from "leva"

import { useAnimationContext } from "../../Context/AnimationContext"

const modelPath = `${import.meta.env.BASE_URL}robot.glb`
const mobileQuery = "(max-width: 768px)"

const Model = () => {
  const { setRobotActions } = useAnimationContext()

  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(mobileQuery).matches
  )

  const { scene, animations } = useGLTF(modelPath)
  const { actions } = useAnimations(animations, scene)

  const { position, rotation, desktopScale, mobileScale } = useControls(
    "Robot Transform",
    {
      position: {
        label: "Position",
        value: { x: -0.18, y: 0.71, z: 0.6 },
        step: 0.01,
      },
      rotation: {
        label: "Rotation (rad)",
        value: { x: 0.12, y: 1.37, z: -0.07 },
        step: 0.01,
      },
      desktopScale: {
        label: "Desktop Scale",
        value: 0.84,
        min: 0.01,
        max: 5,
        step: 0.01,
      },
      mobileScale: {
        label: "Mobile Scale",
        value: 0.6,
        min: 0.01,
        max: 5,
        step: 0.01,
      },
    }
  )

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

  return (
    <group
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={isMobile ? mobileScale : desktopScale}
    >
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(modelPath)

export default Model