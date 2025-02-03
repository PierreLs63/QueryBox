import { useAuthContext } from '../../context/AuthContext';
import { baseURL } from '../../utils/variables.js';

const useVerifyEmail = () => {
    const { setAuthUser } = useAuthContext();

    const verifyEmail = async (token) => {
        const api = `${baseURL}/auth/verification-email/${token}`;
        try {
            const response = await fetch(api, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            
            localStorage.setItem('user', JSON.stringify(data));
            setAuthUser(data);
            return { success: true, data };
        } catch (error) {
            return { success: false, error };
        }
    }
    
    return verifyEmail;
};

export default useVerifyEmail;