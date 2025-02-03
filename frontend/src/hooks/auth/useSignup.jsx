import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAuthContext } from '../../context/AuthContext';
import { baseURL } from '../../utils/variables';

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();

    const api = `${baseURL}/auth/signup`;

    const signup = async ({username, email, password, confirmPassword}) => {
        
        setLoading(true);

        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, email, password, confirmPassword})
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.setItem('user', JSON.stringify(data));
            setAuthUser(data);

        } catch (error) {
            toast.error(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    
    };
    return { loading, signup }
};

export default useSignup;