import { useState } from 'react'
import toast from 'react-hot-toast';
import baseURL from '../../utils/variables';

const useGetRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loadingGetRequests, setLoadingGetRequests] = useState(false);
    const [errorGetRequests, setErrorGetRequests] = useState(null);
    const [successGetRequests, setSuccessGetRequests] = useState(null);
    const [collectionId, setCollectionId] = useState(null);
    const [page, setPage] = useState(null);
    const [perPage, setPerPage] = useState(null);

    const getRequests = async (collectionId, page, perPage) => {
        setLoadingGetRequests(true);
        setErrorGetRequests(null);
        setSuccessGetRequests(null);
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
            setErrorGetRequests(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingGetRequests(false);
        }
    }
    return { requests, loadingGetRequests, errorGetRequests, successGetRequests, getRequests, collectionId, page, perPage }
}
export default useGetRequests;