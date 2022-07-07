import { Outlet } from 'react-router'
import './index.scss'

const Layout = () => {
  return (
    <div className='App'>
      <div className='TopBar'>
        <></>
      </div>
      <div className='Page'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout