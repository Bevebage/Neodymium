import './App.css';
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout';
import Game from './components/Game';

function App() {
  return (
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Game/>}/>
        </Route>
      </Routes>
  )
}

export default App;
