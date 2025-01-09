import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useDelete = () => {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [errorDelete, setErrorDelete] = useState(null);
    const [successDelete, setSuccessDelete] = useState(null);
    const [requestId, setRequestId] = useState(null);

    const deleteRequest = async (requestId) => {
        setRequestId(requestId);
        setLoadingDelete(true);
        setErrorDelete(null);
        setSuccessDelete(null);
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
            setSuccessDelete(data.message);
        }
        catch (error) {
            setErrorDelete(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingDelete(false);
        }
    }
    return { loadingDelete, errorDelete, successDelete, deleteRequest, requestId }
}

export default useDelete