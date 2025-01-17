import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useDeleteRequest = () => {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [errorDelete, setErrorDelete] = useState(null);
    const [successDelete, setSuccessDelete] = useState(null);

    const deleteRequest = async (requestId) => {
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
            if (data.message && !response.ok) {
                throw new Error(data.message);
            }
            setSuccessDelete(data.message);
            toast.success(data.message);
            return { success: true, message: data.message };
        }
        catch (error) {
            setErrorDelete(error.message);
            toast.error(error.message);
            return { success: false, message: error.message };
        }
        finally {
            setLoadingDelete(false);
        }
    }
    return { loadingDelete, errorDelete, successDelete, deleteRequest }
}

export default useDeleteRequest