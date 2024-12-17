import Connexion from './src/pages/connexion/Connexion.jsx'
import Inscription from './src/pages/inscription/Inscription.jsx'
import Reinitialiser from './src/pages/reinitialiser/Reinitialiser.jsx'
import Mailenvoye from './src/pages/mailenvoye/Mailenvoye.jsx'
import Mailverifie from './src/pages/mailverifie/Mailverifie.jsx'
import Accueil from './src/pages/accueil/Accueil.jsx'
import Debutant from './src/pages/debutant/Debutant.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/reinitialiser" element={<Reinitialiser />} />
            <Route path="/mailenvoye" element={<Mailenvoye />} />
            <Route path="/mailverifie" element={<Mailverifie />} />
            <Route path="/accueil" element={<Accueil />} />
            <Route path="/debutant" element={<Debutant />} />
        </Routes>
      </div>
    </Router>
  )
  
}

export default App