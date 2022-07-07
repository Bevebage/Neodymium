import { useEffect, useState } from 'react'
import './index.scss'

const HOST = window.location.origin.replace(/^http/, 'ws')
console.log(HOST)
const client = new WebSocket(HOST)

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