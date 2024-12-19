import { useState } from 'react'
import toast from 'react-hot-toast';
import baseURL from '../../utils/variables';

const useCreateRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [collectionId, setCollectionId] = useState(null);
    const [name, setName] = useState(null);
    const [requests, setRequests] = useState(null);

    const createRequest = async (collectionId, name, requests) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        setCollectionId(collectionId);
        setName(name);
        setRequests(requests);
        const api = `${baseURL}/collection/${collectionId}`;
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, requests})
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
    return { loading, error, success, createRequest, collectionId, name, requests }
}

export default useCreateRequest