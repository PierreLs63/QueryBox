//I want you to create a custom hook that fetches a workspace by its id. The hook should accept an id as an argument and return the workspace object. The workspace object should have the following properties: id, name, and description. If the workspace is not found, the hook should return null.

import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';
import useCurrentState from '../../zustand/CurrentState';

const useNameById = () => {
    const [loadingNameById, setLoadingNameById] = useState(false);
    const [errorNameById, setErrorNameById] = useState(null);
    const [successNameById, setSuccessNameById] = useState(null);
    const CurrentState = useCurrentState();

    const getNameById = async () => {
        setLoadingNameById(true);
        setErrorNameById(null);
        setSuccessNameById(null);
        const api = `${baseURL}/workspace/${CurrentState.workspaceId}`;
        try {
            const response = await fetch(api);
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            if(data.message !== undefined) {
                toast.error(data.message);
                setErrorNameById(data.message);
            }
            CurrentState.setWorkspaceName(data.name)
            setSuccessNameById(data.name);
        }
        catch (error) {
            setErrorNameById(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingNameById(false);
        }
    }
    return { loadingNameById, errorNameById, successNameById, getNameById }
}

export default useNameById;
