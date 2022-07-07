import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import './index.scss'

const socket = io()

const Game = () => {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    socket.on('tick', (tickNum) => {
      setTick(tickNum)
    })
    
    return () => {
      socket.off('tick')
    }
  }, [])

  return (
    <div className='Game'>
      <p>Tick: {tick}</p>
    </div>
  )
}

export default Game