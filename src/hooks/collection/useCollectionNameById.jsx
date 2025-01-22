import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';
import useCurrentState from '../../zustand/CurrentState';

const useCollectionNameById = () => {
    const [loadingCollectionNameById, setLoadingCollectionNameById] = useState(false);
    const [errorCollectionNameById, setErrorCollectionNameById] = useState(null);
    const [successCollectionNameById, setSuccessCollectionNameById] = useState(null);
    const CurrentState = useCurrentState();

    const getCollectionNameById = async () => {
        setLoadingCollectionNameById(true);
        setErrorCollectionNameById(null);
        setSuccessCollectionNameById(null);
        const api = `${baseURL}/workspace/${CurrentState.workspaceId}/collection/${CurrentState.collectionId}`;
        try {
            const response = await fetch(api);
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            if(data.message !== undefined) {
                toast.error(data.message);
                setErrorCollectionNameById(data.message);
            }
            CurrentState.setCollectionName(data.name)
            setSuccessCollectionNameById(data.name);
        }
        catch (error) {
            setErrorCollectionNameById(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingCollectionNameById(false);
        }
    }
    return { loadingCollectionNameById, errorCollectionNameById, successCollectionNameById, getCollectionNameById }
}

export default useCollectionNameById;
