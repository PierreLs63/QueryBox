import { useState } from 'react';
import toast from 'react-hot-toast';
import baseURL from '../../utils/variables';

const useGetMyHistory = () => {
    const [history, setHistory] = useState(null);
    const [loadingGetMyHistory, setLoadingGetMyHistory] = useState(false);
    const [errorGetMyHistory, setErrorGetMyHistory] = useState(null);
    const [successGetMyHistory, setSuccessGetMyHistory] = useState(null);
    const [workspaceId, setWorkspaceId] = useState(null);
    const [page, setPage] = useState(null);
    const [perPage, setPerPage] = useState(null);

    const getMyHistory = async (workspaceId, page = null, perPage = null) => {
        setWorkspaceId(workspaceId);
        setPage(page);
        setPerPage(perPage);
        setLoadingGetMyHistory(true);
        setErrorGetMyHistory(null);
        setHistory(null);
        setSuccessGetMyHistory(null);

        //Optional params
        let api = `${baseURL}/workspace/${workspaceId}/history/me/`;
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
            setSuccessGetMyHistory(true);
        } catch (error) {
            setErrorGetMyHistory(error.message);
            toast.error(error.message);
        } finally {
            setLoadingGetMyHistory(false);
        }
    };

    return { history, loadingGetMyHistory, errorGetMyHistory, getMyHistory, workspaceId, page, perPage, successGetMyHistory };
};

export default useGetMyHistory;
