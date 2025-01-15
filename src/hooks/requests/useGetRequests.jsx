import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useGetRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loadingGetRequests, setLoadingGetRequests] = useState(false);
    const [errorGetRequests, setErrorGetRequests] = useState(null);
    const [successGetRequests, setSuccessGetRequests] = useState(null);
    const [collectionId, setCollectionId] = useState(null);
    const [page, setPage] = useState(null);
    const [perPage, setPerPage] = useState(null);

    const getRequests = async (collectionId, page=null, perPage=null) => {
        setLoadingGetRequests(true);
        setErrorGetRequests(null);
        setSuccessGetRequests(null);
        setCollectionId(collectionId);
        setPage(page);
        setPerPage(perPage);

        //Optional params
        let api = `${baseURL}/collection/${collectionId}/requests/`;
        const params = new URLSearchParams();
        if (page !== null) params.append('page', page);
        if (perPage !== null) params.append('perpage', perPage);

        if (params.toString()) {
            api += `?${params.toString()}`;
        }


        try {
            const response = await fetch(api);
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setRequests(data);
            return data;
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