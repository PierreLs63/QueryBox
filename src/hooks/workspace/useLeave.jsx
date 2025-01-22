import { useState } from 'react'
import toast from 'react-hot-toast';
import {baseURL} from '../../utils/variables';
import useCurrentState from '../../zustand/CurrentState';
import useCollaboratorsDataStore from '../../zustand/Collaborators';

const useLeave = () => {
    const [loadingLeave, setLoadingLeave] = useState(false);
    const [errorLeave, setErrorLeave] = useState(null);
    const [successLeave, setSuccessLeave] = useState(null);
    const CurrentState = useCurrentState();
    const CollaboratorsZustand = useCollaboratorsDataStore();

    const leave = async (workspaceId, invitation = false) => {
        setLoadingLeave(true);
        setErrorLeave(null);
        setSuccessLeave(null);
        const api = `${baseURL}/workspace/${workspaceId}/leave`;
        try {
            const response = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.message && !response.ok) {
                throw new Error(data.message);
            }
            
            if (!invitation) {
                toast.success(data.message);
                setSuccessLeave(data.message);
                CurrentState.clearAll();
                CollaboratorsZustand.clearAll();
            }
        }
        catch (error) {
            setErrorLeave(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingLeave(false);
        }
    }
    return { loadingLeave, errorLeave, successLeave, leave }
}

export default useLeave