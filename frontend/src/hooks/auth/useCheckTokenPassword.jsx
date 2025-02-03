import { useState } from 'react';
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables.js';

const useCheckTokenPassword = () => {

    const [loading, setLoading] = useState(false);

    const checkTokenPassword = async (token) => {
        
        const api = `${baseURL}/auth/resetPassword/${token}`;
        try {
            setLoading(true);
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
            return true;
        } catch {
            return false;
        } finally {
            setLoading(false);
        }
    }
    
    return {loading, checkTokenPassword};
};

export default useCheckTokenPassword;