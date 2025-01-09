import { useParams } from 'react-router-dom'
import useVerificationEmail from '../../hooks/auth/useVerificationEmail';

const VerifyEmail = () => {
    const { token } = useParams();
    
    const verifyEmail = useVerificationEmail();
    
    verifyEmail(token);

}

export default VerifyEmail