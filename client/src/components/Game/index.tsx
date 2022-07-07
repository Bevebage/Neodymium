import { useEffect, useState } from 'react'
import './index.scss'

const client = new WebSocket('ws://localhost:5000')

const Game = () => {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    client.onopen = () => {
      console.log('server connected')
    }

    client.onmessage = (e) => {
      setTick(e.data)
    }
  }, [])

  return (
    <div className='Game'>
      <p>Tick: {tick}</p>
    </div>
  )
}

export default Game