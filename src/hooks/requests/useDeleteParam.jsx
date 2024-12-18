//hook to DELETE /request/paramRequest/:paramRequestId pour supprimer un paramRequest

import { useState } from 'react'
import toast from 'react-hot-toast';
import baseURL from '../../utils/variables';

const useDeleteParam = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [paramRequestId, setParamRequestId] = useState(null);

    const deleteParam = async (paramRequestId) => {
        setParamRequestId(paramRequestId);
        setLoading(true);
        setError(null);
        setSuccess(null);
        const api = `${baseURL}/request/paramRequest/${paramRequestId}`;
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
    return { loading, error, success, deleteParam, paramRequestId }
}

export default useDeleteParam