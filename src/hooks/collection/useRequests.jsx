import { useState } from 'react'
import toast from 'react-hot-toast';
import baseURL from '../../utils/variables';

const useRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [collectionId, setCollectionId] = useState(null);

    const getRequests = async (collectionId) => {
        if (!collectionId) return;
        setCollectionId(collectionId);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseURL}/collection/${collectionId}/requests`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setRequests(data.requests);
        }
        catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    return { requests, loading, error, getRequests, collectionId }
}

export default useRequests
