import { useState } from 'react';
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables.js';

const useResetPassword = () => {

    const [loading, setLoading] = useState(false);

    const resetPassword = async (token, password, confirmPassword) => {
        const api = `${baseURL}/auth/resetPassword/${token}`;
        try {
            setLoading(true);
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({password, confirmPassword})
            });
            
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            
            toast.success(data.message);

            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    }
    
    return {loading, resetPassword};
};

export default useResetPassword;