import Connexion from './src/pages/connexion/Connexion.jsx'
import Inscription from './src/pages/inscription/Inscription.jsx'
import Reinitialiser from './src/pages/reinitialiser/Reinitialiser.jsx'
import Mailenvoye from './src/pages/mailenvoye/Mailenvoye.jsx'
import Mailverifie from './src/pages/mailverifie/Mailverifie.jsx'
import Accueil from './src/pages/accueil/Accueil.jsx'
import Debutant from './src/pages/debutant/Debutant.jsx'
import Tuto from './src/pages/tuto/Tuto.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

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
              <Route path="/accueil" element={<Accueil />} />
              <Route path="/debutant" element={<Debutant />} />
              <Route path="/tuto" element={<Tuto />} />
          </Routes>
      </Router>
    </>
  )
  
}

export default App