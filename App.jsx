import Connexion from './src/pages/connexion/Connexion.jsx'
import Inscription from './src/pages/inscription/Inscription.jsx'
import Mailenvoye from './src/pages/mailenvoye/Mailenvoye.jsx'
import Reinitialiser from './src/pages/reinitialiser/Reinitialiser.jsx'
import Mailverifie from './src/pages/mailverifie/Mailverifie.jsx'
import Accueil from './src/pages/accueil/Accueil.jsx'
import Debutant from './src/pages/debutant/Debutant.jsx'
import Tuto from './src/pages/tuto/Tuto.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './src/context/AuthContext.jsx';
import VerificationEmail from './src/pages/verificationEmail/VerificationEmail.jsx';
import ChangerMotDePasse from './src/pages/changermotdepasse/ChangerMotDePasse.jsx';
import ConfirmerMail from './src/pages/confirmermail/ConfirmerMail.jsx'

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
          <Route path="/" element={authUser ? (authUser?.isVerified ? <Navigate to="/accueil" /> : <Navigate to="/mailenvoye" />) : <Navigate to="/connexion" />} />
          <Route path="/connexion" element={authUser ? (authUser?.isVerified ? <Navigate to="/accueil" /> : <Navigate to="/mailenvoye" />) : <Connexion />} />
          <Route path="/inscription" element={authUser ? (authUser?.isVerified ? <Navigate to="/accueil" /> : <Navigate to="/mailenvoye" />) : <Inscription />} />
          <Route path="/reinitialiser" element={authUser ? (authUser?.isVerified ? <Reinitialiser /> : <Navigate to="/mailenvoye" />) : <Navigate to='/connexion' />} />
          <Route path="/mailenvoye" element={authUser ? (authUser?.isVerified ? <Navigate to="/accueil" /> : <Mailenvoye />) : <Navigate to='/connexion' />} />
          <Route path="/mailverifie" element={authUser ? (authUser?.isVerified ? <Mailverifie /> : <Navigate to="/mailenvoye" />) : <Navigate to='/connexion' /> } />
          <Route path="/accueil" element={authUser ? (authUser?.isVerified ? <Accueil /> : <Navigate to="/mailenvoye" />) : <Navigate to="/connexion" /> } />
          <Route path="/debutant" element={authUser ? (authUser?.isVerified ? <Debutant /> : <Navigate to="/mailenvoye" />) : <Navigate to="/connexion" />} />
          <Route path="/tuto" element={authUser ? (authUser?.isVerified ? <Tuto /> : <Navigate to="/mailenvoye" />) : <Navigate to="/connexion" />} />
          <Route path="/verificationEmail/:token" element={authUser ? (authUser?.isVerified ? <Navigate to="/mailverifie" /> : <VerificationEmail /> ) : <VerificationEmail /> } />
          <Route path="*" element={<Navigate to="/" />} />
<<<<<<< HEAD
          <Route path="/resetPassword/:token" element={<ChangerMotDePasse />} />
          <Route path="/confirmerMail" element={<ConfirmerMail />} />
>>>>>>> 96a89e91a174526d5f379959e71d69b33250deaf
        </Routes>
      </Router>
    </>
  );
}

export default App;
