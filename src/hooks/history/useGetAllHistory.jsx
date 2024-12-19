import { useState } from 'react';
import toast from 'react-hot-toast';
import baseURL from '../../utils/variables';

const useGetAllHistory = () => {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [workspaceId, setWorkspaceId] = useState(null);
    const [page, setPage] = useState(null);
    const [perPage, setPerPage] = useState(null);

    const getAllHistory = async (workspaceId, page = null, perPage = null) => {
        setWorkspaceId(workspaceId);
        setPage(page);
        setPerPage(perPage);
        setLoading(true);
        setError(null);
        setHistory(null);

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
            if (data.error) {
                throw new Error(data.error);
            }
            setHistory(data.history);
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { history, loading, error, getAllHistory, workspaceId, page, perPage };
};

export default useGetAllHistory;
