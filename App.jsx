import './App.css'
import Connexion from './src/pages/connexion/Connexion.jsx'
import Inscription from './src/pages/inscription/Inscription.jsx'
//import Debutant from './src/pages/debutant/Debutant.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
        </Routes>
      </div>
    </Router>
  )
  
}

export default App