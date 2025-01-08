import { useState } from 'react'
import toast from 'react-hot-toast';
import baseURL from '../../utils/variables';


const useLeave = () => {
    const [loadingLeave, setLoadingLeave] = useState(false);
    const [errorLeave, setErrorLeave] = useState(null);
    const [successLeave, setSuccessLeave] = useState(null);

    const leave = async (workspaceId) => {
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
            if (data.error) {
                throw new Error(data.error);
            }
            setSuccessLeave(data.message);
        }
        catch (error) {
            setErrorLeave(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingLeave(false);
        }
    }
    return { loadingLeave, errorLeave, successLeave, leave, workspaceId }
}

export default useLeave