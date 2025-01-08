import Connexion from './src/pages/connexion/Connexion.jsx'
import Inscription from './src/pages/inscription/Inscription.jsx'
import Reinitialiser from './src/pages/reinitialiser/Reinitialiser.jsx'
import Mailenvoye from './src/pages/mailenvoye/Mailenvoye.jsx'
import Mailverifie from './src/pages/mailverifie/Mailverifie.jsx'
import Accueil from './src/pages/accueil/Accueil.jsx'
import Debutant from './src/pages/debutant/Debutant.jsx'
import Tuto from './src/pages/tuto/Tuto.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './src/context/AuthContext.jsx';

function App() {
  const { authUser } = useAuthContext();
  return (
    <>
      <Toaster toastOptions={{
        // Define default options
        className: 'font-bold',
        duration: 5000,
      }} />
      <Router>
        <Routes>
          {/* default path navigate to /connexion */}
          <Route path="/" element={authUser ? <Navigate to="/accueil" /> : <Navigate to="/connexion" />} />
          <Route path="/connexion" element={authUser ? <Navigate to="/accueil" /> : <Connexion />} />
          <Route path="/inscription" element={authUser ? <Navigate to="/accueil" /> : <Inscription />} />
          <Route path="/reinitialiser" element={authUser ? <Navigate to="/accueil" /> : <Reinitialiser />} />
          <Route path="/mailenvoye" element={authUser ? <Navigate to="/accueil" /> : <Mailenvoye />} />
          <Route path="/mailverifie" element={authUser ? <Navigate to="/accueil" /> : <Mailverifie />} />
          <Route path="/accueil" element={authUser ? <Accueil /> : <Navigate to="/connexion" /> } />
          <Route path="/debutant" element={authUser ? <Debutant /> : <Navigate to="/connexion" /> } />
          <Route path="/tuto" element={authUser ? <Tuto /> : <Navigate to="/connexion" /> } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
