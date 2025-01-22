import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';
import useCurrentState from '../../zustand/CurrentState';

const useRequestNameById = () => {
    const [loadineRequestNameById, setLoadineRequestNameById] = useState(false);
    const [erroeRequestNameById, setErroeRequestNameById] = useState(null);
    const [succeseRequestNameById, setSucceseRequestNameById] = useState(null);
    const CurrentState = useCurrentState();

    const geeRequestNameById = async () => {
        setLoadineRequestNameById(true);
        setErroeRequestNameById(null);
        setSucceseRequestNameById(null);
        const api = `${baseURL}/request/${CurrentState.requestId}`;
        try {
            const response = await fetch(api);
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            if(data.message !== undefined) {
                toast.error(data.message);
                setErroeRequestNameById(data.message);
            }
            CurrentState.setCollectionName(data.name)
            setSucceseRequestNameById(data.name);
        }
        catch (error) {
            setErroeRequestNameById(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadineRequestNameById(false);
        }
    }
    return { loadineRequestNameById, erroeRequestNameById, succeseRequestNameById, geeRequestNameById }
}

export default useRequestNameById;
