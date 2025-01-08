import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../../public/utils/variables';

const useInvite = () => {
    const [loadingInvite, setLoadingInvite] = useState(false);
    const [errorInvite, setErrorInvite] = useState(null);
    const [successInvite, setSuccessInvite] = useState(null);
    const [invitePrivilege, setInvitePrivilege] = useState(10); // 10 pour viewer par défaut
    const [inviteUsername, setInviteUsername] = useState(""); // état pour le username
    
    const invite = async (workspaceId, username, level) => {
        setLoadingInvite(true);
        setErrorInvite(null);
        setSuccessInvite(null);
        const api = `${baseURL}/workspace/${workspaceId}/invite`;
        try {
            const response = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, level})
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
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