import { useEffect } from "react"
import { LoopOnce } from "three"

import { useAnimationContext } from "../Context/AnimationContext"
import "./AnimationButtons.css"

const AnimationButtons = () => {
  const { robotActions } = useAnimationContext()

  const flyAction = robotActions?.fly
  const walkAction = robotActions?.walk
  const waveAction = robotActions?.wave

  const buttons = [
    { label: "Fly", action: flyAction },
    { label: "Walk", action: walkAction },
    { label: "Wave", action: waveAction },
  ]

  useEffect(() => {
    return () => {
      flyAction?.stop()
      walkAction?.stop()
      waveAction?.stop()
    }
  }, [flyAction, walkAction, waveAction])

  const playAnimation = (action) => {
    if (!action) return

    for (const { action: otherAction } of buttons) {
      if (otherAction !== action) {
        otherAction?.stop()
      }
    }

    action.reset()
    action.setEffectiveWeight(1)
    action.setEffectiveTimeScale(1)
    action.setLoop(LoopOnce, 1)
    action.clampWhenFinished = true
    action.play()
  }

  return (
    <div
      className="animation-buttons"
      style={{
        gridTemplateColumns: "repeat(3, minmax(75px, 1fr))",
        width: "fit-content",
      }}
    >
      {buttons.map(({ label, action }) => (
        <button
          key={label}
          type="button"
          className="animation-button"
          disabled={!action}
          onClick={() => playAnimation(action)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default AnimationButtons