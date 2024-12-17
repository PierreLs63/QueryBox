import './App.css'
import Connexion from './src/pages/connexion/Connexion.jsx'
import Inscription from './src/pages/inscription/Inscription.jsx'
import Reinitialiser from './src/pages/reinitialiser/Reinitialiser.jsx'
import Mailenvoye from './src/pages/mailenvoye/Mailenvoye.jsx'
import Mailverifie from './src/pages/mailverifie/Mailverifie.jsx'
//import Debutant from './src/pages/debutant/Debutant.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Toaster toastOptions={{
      // Define default options
      className: 'font-bold',
      duration: 5000}} />
      <Router>
          <Routes>
              <Route path="/connexion" element={<Connexion />} />
              <Route path="/inscription" element={<Inscription />} />
              <Route path="/reinitialiser" element={<Reinitialiser />} />
              <Route path="/mailenvoye" element={<Mailenvoye />} />
              <Route path="/mailverifie" element={<Mailverifie />} />
          </Routes>
      </Router>
    </>
  )
  
}

export default App