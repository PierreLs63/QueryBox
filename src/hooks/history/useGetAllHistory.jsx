import { useState } from 'react';
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useGetAllHistory = () => {
    const [history, setHistory] = useState(null);
    const [loadingGetAllHistory, setLoadingGetAllHistory] = useState(false);
    const [errorGetAllHistory, setErrorGetAllHistory] = useState(null);
    const [successGetAllHistory, setSuccessGetAllHistory] = useState(null);
    const [workspaceId, setWorkspaceId] = useState(null);
    const [page, setPage] = useState(null);
    const [perPage, setPerPage] = useState(null);

    const getAllHistory = async (workspaceId, page = null, perPage = null) => {
        setWorkspaceId(workspaceId);
        setPage(page);
        setPerPage(perPage);
        setLoadingGetAllHistory(true);
        setErrorGetAllHistory(null);
        setHistory(null);
        setSuccessGetAllHistory(null);

        //Optional params
        let api = `${baseURL}/workspace/${workspaceId}/history/`;
        const params = new URLSearchParams();
        if (page !== null) params.append('page', page);
        if (perPage !== null) params.append('perpage', perPage);

        if (params.toString()) {
            api += `?${params.toString()}`;
        }

        try {
            const response = await fetch(api, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setHistory(data);
            setSuccessGetAllHistory(true);
        } catch (error) {
            setErrorGetAllHistory(error.message);
            toast.error(error.message);
        } finally {
            setLoadingGetAllHistory(false);
        }
    };

    return { history, loadingGetAllHistory, errorGetAllHistory, getAllHistory, workspaceId, page, perPage, successGetAllHistory };
};

export default useGetAllHistory;
