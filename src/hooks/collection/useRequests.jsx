import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [errorRequests, setErrorRequests] = useState(null);
    const [successRequests, setSuccessRequests] = useState(null);
    const [collectionId, setCollectionId] = useState(null);

    const getRequests = async (collectionId) => {
        if (!collectionId) return;
        setCollectionId(collectionId);
        setLoadingRequests(true);
        setErrorRequests(null);
        setSuccessRequests(null);
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
            setSuccessRequests('Requests fetched successfully');
            return(data);
        }
        catch (error) {
            setErrorRequests(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingRequests(false);
        }
    }
    return { requests, loadingRequests, errorRequests, getRequests, collectionId, successRequests }
}

export default useRequests
