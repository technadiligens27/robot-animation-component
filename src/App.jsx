
import './App.css'
import Experience from './Experience/Experience'
import AnimationButtons from './AnimationButtons/AnimationButtons'
import { Suspense } from 'react'
import Loading from './Loading/Loading'

function App() {

  return (
    <div className='app'>
      <Suspense fallback={<Loading/>}>
        <Experience/>
        <AnimationButtons/>
      </Suspense>

    </div>
  )
}

export default App
