import { useState } from 'react'
import toast from 'react-hot-toast';
import baseURL from '../../utils/variables';

const useChangeName = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [requestId, setRequestId] = useState(null);
    const [newRequestName, setNewRequestName] = useState(null);

    const changeName = async (requestId, newRequestName) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        setRequestId(requestId);
        setNewRequestName(newRequestName);
        const api = `${baseURL}/requests/${requestId}/name`;
        try {
            const response = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: newRequestName})
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
    return { loading, error, success, changeName, requestId, newRequestName }
}

export default useChangeName