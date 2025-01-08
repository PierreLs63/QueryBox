import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAuthContext } from '../../context/AuthContext';
import { baseURL } from '../../utils/variables';

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();
    
    const api = `${baseURL}/auth/logout`;
    const logout = async () => {
        setLoading(true);
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.removeItem('user');
            setAuthUser(null);
        } catch (error) {
            toast.error(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };
    return { loading, logout }
}

export default useLogout