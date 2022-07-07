import { useEffect } from 'react'
import { io } from 'socket.io-client'
import './index.scss'

const socket = io('http://localhost:3001')

const Game = () => {
  const sendClick = () => {
    socket.emit('click', {
      element: 'test'
    })
  }

  useEffect(() => {
    socket.on('tick', () => {
      console.log('tick')
    })
  }, [socket])

  return (
    <div className='Game'>
      <p>Game </p>
    </div>
  )
}

export default Game