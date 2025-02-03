import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useGetWorkspaceInvitations = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
    const [errorWorkspaces, setErrorWorkspaces] = useState(null);
    const [successWorkspaces, setSuccessWorkspaces] = useState(null);

    const getWorkspaceInvitations = async () => {
        setLoadingWorkspaces(true);
        setErrorWorkspaces(null);
        setSuccessWorkspaces(null);
        const api = `${baseURL}/workspace/invites`;
        try {
            const response = await fetch(api);
            const data = await response.json();
            //workspaces is an array of objects with id and name
            setWorkspaces(data);
            if (!response.ok) {
                throw new Error("Error fetching workspace invitations");
            }
            return data;
        }
        catch (error) {
            setErrorWorkspaces(error);
            toast.error(error.message);
            return {};
        }
        finally {
            setLoadingWorkspaces(false);
        }
    }
    return { workspaces, loadingWorkspaces, errorWorkspaces, successWorkspaces, getWorkspaceInvitations }
}
export default useGetWorkspaceInvitations;