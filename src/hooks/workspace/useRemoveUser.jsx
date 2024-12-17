import { useState } from 'react';
import toast from 'react-hot-toast';
import dotenv from 'dotenv';
import { baseURL } from '../../../public/utils/variables';
dotenv.config();

const useRemoveUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [userId, setUserId] = useState(null);
    const removeUser = async (userId) => {
        setUserId(userId);
        setLoading(true);
        setError(null);
        setSuccess(null);
        const api = `${baseURL}/user/${userId}/remove`;
        try {
            const response = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userBId : userId })
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setSuccess(data.message);
        }
        catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    return { loading, error, success, removeUser, userId }
}

export default useRemoveUser
