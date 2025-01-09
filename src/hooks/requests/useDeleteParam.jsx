import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useDeleteParam = () => {
    const [loadingDeleteParam, setLoadingDeleteParam] = useState(false);
    const [errorDeleteParam, setErrorDeleteParam] = useState(null);
    const [successDeleteParam, setSuccessDeleteParam] = useState(null);
    const [paramRequestId, setParamRequestId] = useState(null);

    const deleteParam = async (paramRequestId) => {
        setParamRequestId(paramRequestId);
        setLoadingDeleteParam(true);
        setErrorDeleteParam(null);
        setSuccessDeleteParam(null);
        const api = `${baseURL}/request/paramRequest/${paramRequestId}`;
        try {
            const response = await fetch(api, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setSuccessDeleteParam(data.message);
        }
        catch (error) {
            setErrorDeleteParam(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingDeleteParam(false);
        }
    }
    return { loadingDeleteParam, errorDeleteParam, successDeleteParam, deleteParam, paramRequestId }
}

export default useDeleteParam