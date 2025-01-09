import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useInvite = () => {
    const [loadingInvite, setLoadingInvite] = useState(false);
    const [errorInvite, setErrorInvite] = useState(null);
    const [successInvite, setSuccessInvite] = useState(null);
    const [invitePrivilege, setInvitePrivilege] = useState(10); // 10 pour viewer par défaut
    const [inviteUsername, setInviteUsername] = useState(""); // état pour le username
    
    const invite = async ({workspaceId}, username, level) => {
        setLoadingInvite(true);
        setErrorInvite(null);
        setSuccessInvite(null);
        console.log(workspaceId);
        const api = `${baseURL}/workspace/${workspaceId}/invite`;
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, level})
            });
            const data = await response.json();

            console.log(data);
            if (data.error) {
                throw new Error(data.error);
            }

            if(data.message !== undefined && response.ok) {
                toast.success(data.message);
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