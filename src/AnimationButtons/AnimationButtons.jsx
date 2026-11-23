import { useCallback, useEffect, useRef, useState } from "react"
import * as THREE from "three"

import { useAnimationContext } from "../Context/AnimationContext"
import "./AnimationButtons.css"

const animationButtons = ["idle", "walk", "wave", "run"]

const ANIMATION_FPS = 24
const FADE_DURATION = 0.2

const movementLoops = {
  walk: { startFrame: 13, endFrame: 36 },
  run: { startFrame: 12, endFrame: 36 },
}

const AnimationButtons = () => {
  const { robotActions } = useAnimationContext()
  const [activeAnimation, setActiveAnimation] = useState(null)

  const currentAnimation = useRef(null)
  const stopRequested = useRef(false)

  const playAnimation = useCallback(
    (animationName) => {
      if (!robotActions) return

      const nextAction = robotActions[animationName]

      if (!nextAction) {
        console.warn(`Animation "${animationName}" was not found.`)
        return
      }

      const previousAction = robotActions[currentAnimation.current]

      if (previousAction && previousAction !== nextAction) {
        previousAction.fadeOut(FADE_DURATION)
      }

      nextAction.reset()
      nextAction.setEffectiveWeight(1)
      nextAction.setEffectiveTimeScale(1)
      nextAction.setLoop(THREE.LoopOnce, 1)
      nextAction.clampWhenFinished = true

      // Walk and Run use the frame callback to control their loop ranges.
      nextAction.paused = Boolean(movementLoops[animationName])

      nextAction.fadeIn(FADE_DURATION)
      nextAction.play()

      stopRequested.current = false
      currentAnimation.current = animationName
      setActiveAnimation(animationName)
    },
    [robotActions]
  )

  const handleAnimationClick = (animationName) => {
    if (!robotActions) return

    const currentName = currentAnimation.current
    const currentLoop = movementLoops[currentName]

    if (currentLoop) {
      if (animationName === "idle") {
        stopRequested.current = true
        return
      }

      if (animationName === currentName) {
        const loopEnd = currentLoop.endFrame / ANIMATION_FPS

        // Cancel a queued stop while the current cycle is still playing.
        if (robotActions[currentName].time < loopEnd) {
          stopRequested.current = false
        }

        return
      }
    }

    playAnimation(animationName)
  }

  useEffect(() => {
    if (!robotActions) return

    return () => {
      Object.values(robotActions).forEach((action) => action?.stop())
      currentAnimation.current = null
      stopRequested.current = false
    }
  }, [robotActions])

  useEffect(() => {
    const loop = movementLoops[activeAnimation]
    const action = robotActions?.[activeAnimation]

    if (!loop || !action) return

    const clipEnd = action.getClip().duration
    const loopStart = loop.startFrame / ANIMATION_FPS
    const loopEnd = Math.min(loop.endFrame / ANIMATION_FPS, clipEnd)
    const loopDuration = loopEnd - loopStart

    if (loopDuration <= 0) {
      console.warn(`Check the loop frames for "${activeAnimation}".`)
      action.setLoop(THREE.LoopRepeat, Infinity)
      action.paused = false
    }

    let frameId
    let previousTime = performance.now()

    const updateMovement = (now) => {
      if (currentAnimation.current !== activeAnimation) return

      const delta = (now - previousTime) / 1000
      previousTime = now

      if (loopDuration <= 0) {
        if (stopRequested.current) {
          playAnimation("idle")
          return
        }
      } else {
        const nextTime = action.time + delta

        if (stopRequested.current) {
          action.time = Math.min(nextTime, clipEnd)

          if (nextTime >= clipEnd) {
            playAnimation("idle")
            return
          }
        } else if (nextTime >= loopEnd) {
          action.time = loopStart + ((nextTime - loopEnd) % loopDuration)
        } else {
          action.time = nextTime
        }
      }

      frameId = requestAnimationFrame(updateMovement)
    }

    frameId = requestAnimationFrame(updateMovement)

    return () => cancelAnimationFrame(frameId)
  }, [activeAnimation, robotActions, playAnimation])

  return (
    <div className="animation-buttons">
      {animationButtons.map((animationName) => {
        const isActive =
          Boolean(robotActions) && activeAnimation === animationName

        return (
          <button
            key={animationName}
            type="button"
            disabled={!robotActions}
            aria-pressed={isActive}
            className={
              isActive
                ? "animation-button animation-button-active"
                : "animation-button"
            }
            onClick={() => handleAnimationClick(animationName)}
          >
            {animationName}
          </button>
        )
      })}
    </div>
  )
}

export default AnimationButtons