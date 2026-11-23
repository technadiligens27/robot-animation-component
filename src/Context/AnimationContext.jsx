import { createContext, useContext, useState } from "react"

const AnimationContext = createContext(null)

export const AnimationContextProvider = ({ children }) => {
  const [robotActions, setRobotActions] = useState(null)

  return (
    <AnimationContext.Provider value={{ robotActions, setRobotActions }}>
      {children}
    </AnimationContext.Provider>
  )
}

export const useAnimationContext = () => {
  const context = useContext(AnimationContext)

  if (!context) {
    throw new Error(
      "useAnimationContext must be used inside AnimationContextProvider"
    )
  }

  return context
}