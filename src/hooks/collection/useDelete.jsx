import { useState } from 'react'
import toast from 'react-hot-toast';
import baseURL from '../../utils/variables';

const useDelete = () => {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [errorDelete, setErrorDelete] = useState(null);
    const [successDelete, setSuccessDelete] = useState(null);
    const [collectionId, setCollectionId] = useState(null);
    
    const deleteCollection = async (collectionId) => {
        setCollectionId(collectionId);
        setLoadingDelete(true);
        setErrorDelete(null);
        setSuccessDelete(null);
        const api = `${baseURL}/collection/${collectionId}`;
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
            setErrorDelete(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingDelete(false);
        }
    }
    return { loadingDelete, errorDelete, successDelete, deleteCollection, collectionId }
}

export default useDelete
