import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useCreateRequest = () => {
    const [loadingCreateRequest, setLoadingCreateRequest] = useState(false);
    const [errorCreateRequest, setErrorCreateRequest] = useState(null);
    const [successCreateRequest, setSuccessCreateRequest] = useState(null);
    const [collectionId, setCollectionId] = useState(null);
    const [name, setName] = useState(null);
    const [requests, setRequests] = useState(null);

    const createRequest = async (collectionId, name, requests) => {
        setLoadingCreateRequest(true);
        setErrorCreateRequest(null);
        setSuccessCreateRequest(null);
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
            if (data.message && !response.ok) {
                throw new Error(data.message);
            }
            setSuccessCreateRequest(data.message);
            toast.success(data.message);
            return {success: true, ...data};
        }
        catch (error) {
            setErrorCreateRequest(error.message);
            toast.error(error.message);
            return {success: false};
        }
        finally {
            setLoadingCreateRequest(false);
        }
    }
    return { loadingCreateRequest, errorCreateRequest, successCreateRequest, createRequest, collectionId, name, requests }
}

export default useCreateRequest