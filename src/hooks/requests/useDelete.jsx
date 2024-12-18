import { useState } from 'react'
import toast from 'react-hot-toast';
import baseURL from '../../utils/variables';

const useDelete = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [requestId, setRequestId] = useState(null);

    const deleteRequest = async (requestId) => {
        setRequestId(requestId);
        setLoading(true);
        setError(null);
        setSuccess(null);
        const api = `${baseURL}/request/${requestId}`;
        try {
            const response = await fetch(api, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
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
    return { loading, error, success, deleteRequest, requestId }
}

export default useDelete