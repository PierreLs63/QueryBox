import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useWorkspaces = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
    const [errorWorkspaces, setErrorWorkspaces] = useState(null);
    const [successWorkspaces, setSuccessWorkspaces] = useState(null);

    const getWorkspaces = async () => {
        setLoadingWorkspaces(true);
        setErrorWorkspaces(null);
        setSuccessWorkspaces(null);
        const api = `${baseURL}/workspaces`;
        try {
            const response = await fetch(api);
            const data = await response.json();
            //workspaces is an array of objects with id and name
            setWorkspaces(data);
        }
        catch (error) {
            setErrorWorkspaces(error);
            toast.error(error.message);
            }
        finally {
            setLoadingWorkspaces(false);
        }
    }
    return { workspaces, loadingWorkspaces, errorWorkspaces, successWorkspaces, getWorkspaces }
}
export default useWorkspaces;