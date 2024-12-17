import { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
import dotenv from 'dotenv';
dotenv.config();


const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const api = `http://localhost:${process.env.PORT || 5001}/api/${process.env.VERSION || "v1"}/auth/login`;
    const login = async (username, password) => {
        try {

            if (!username || !password) {
                throw new Error('Please fill all fields');
            }
            
            setLoading(true);
            const response = await fetch('/api/auth/login', {
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