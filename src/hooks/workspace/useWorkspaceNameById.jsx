import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';
import useCurrentState from '../../zustand/CurrentState';

const useWorkspaceNameById = () => {
    const [loadingWorkspaceNameById, setLoadingWorkspaceNameById] = useState(false);
    const [errorWorkspaceNameById, setErrorWorkspaceNameById] = useState(null);
    const [successWorkspaceNameById, setSuccessWorkspaceNameById] = useState(null);
    const CurrentState = useCurrentState();

    const getWorkspaceNameById = async () => {
        setLoadingWorkspaceNameById(true);
        setErrorWorkspaceNameById(null);
        setSuccessWorkspaceNameById(null);
        const api = `${baseURL}/workspace/${CurrentState.workspaceId}`;
        try {
            const response = await fetch(api);
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            if(data.message !== undefined) {
                toast.error(data.message);
                setErrorWorkspaceNameById(data.message);
            }
            CurrentState.setWorkspaceName(data.name)
            setSuccessWorkspaceNameById(data.name);
        }
        catch (error) {
            setErrorWorkspaceNameById(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingWorkspaceNameById(false);
        }
    }
    return { loadingWorkspaceNameById, errorWorkspaceNameById, successWorkspaceNameById, getWorkspaceNameById }
}

export default useWorkspaceNameById;
