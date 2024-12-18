import { useState } from 'react'
import toast from 'react-hot-toast';
import baseURL from '../../utils/variables';

const useGetRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [collectionId, setCollectionId] = useState(null);
    const [page, setPage] = useState(null);
    const [perPage, setPerPage] = useState(null);

    const getRequests = async (collectionId, page, perPage) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        setCollectionId(collectionId);
        setPage(page);
        setPerPage(perPage);
        try {
            const response = await fetch(`${baseURL}/request/${collectionId}/requests?page=${page}&perpage=${perPage}`);
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setRequests(data);
        }
        catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    return { requests, loading, error, success, getRequests, collectionId, page, perPage }
}
export default useGetRequests;