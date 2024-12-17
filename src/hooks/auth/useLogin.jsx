import { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';



const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const api = `http://localhost:5001/api/v1/auth/login`;
    const login = async (username, password) => {
        try {
            
            setLoading(true);
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.setItem('user', JSON.stringify(data));
            setAuthUser(data);

        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    return { loading, login }
}

export default useLogin