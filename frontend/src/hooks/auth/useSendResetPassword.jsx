import { useState } from 'react';
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables.js';

const useSendResetPassword = () => {

    const [loading, setLoading] = useState(false);

    const sendResetPassword = async (email) => {
        const api = `${baseURL}/auth/sendResetPassword`;
        try {
            setLoading(true);
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: email})
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
    
    return {loading, sendResetPassword};
};

export default useSendResetPassword;