import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';
import useCollaboratorsDataStore from '../../zustand/Collaborators';

const useInvite = () => {
    const [loadingInvite, setLoadingInvite] = useState(false);
    const [errorInvite, setErrorInvite] = useState(null);
    const [successInvite, setSuccessInvite] = useState(null);
    const [invitePrivilege, setInvitePrivilege] = useState(10); // 10 pour viewer par défaut
    const [inviteUsername, setInviteUsername] = useState(""); // état pour le username
    const collaboratorsZustand = useCollaboratorsDataStore();
    
    const invite = async (workspaceId, username, level) => {
        setLoadingInvite(true);
        setErrorInvite(null);
        setSuccessInvite(null);
        

        const api = `${baseURL}/workspace/${workspaceId}/invite`;
        try {
            if (!workspaceId) throw new Error('Please select a workspace');
            if (!username) throw new Error('Username is required');
            if (!level) throw new Error('Privilege level is required');

            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, privilege: level})
            });
            const data = await response.json();


            if(data.message !== undefined || response.ok) {
                toast.success(data.message);
                collaboratorsZustand.setCollaboratorsWorkspace([...collaboratorsZustand.collaboratorsWorkspace, {username: inviteUsername, privilege: invitePrivilege, hasJoined: false}]);
            } else {
                toast.error(data.message);
                setErrorInvite(data.message);
            }
            
            setSuccessInvite(data.message);
        }
        catch (error) {
            setErrorInvite(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingInvite(false);
        }
    }
    return { loadingInvite, errorInvite, successInvite, invite, invitePrivilege, setInvitePrivilege, inviteUsername, setInviteUsername }
}

export default useInvite