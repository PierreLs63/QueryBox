import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useCollaborateursCollection = () => {
    const [loadingCollaborateurs, setLoadingCollaborateurs] = useState(false);
    const [errorCollaborateurs, setErrorCollaborateurs] = useState(null);
    const [successCollaborateurs, setSuccessCollaborateurs] = useState(null);

    const getCollaborateursCollection = async (collectionId) => {
        setLoadingCollaborateurs(true);
        
        const api = `${baseURL}/collection/${collectionId}/users`;
        try {
            const response = await fetch(api, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.message && !response.ok) {
                throw new Error(data.error);
            }
            setSuccessCollaborateurs(true);
            return data;
        }
        catch (error) {
            setErrorCollaborateurs(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingCollaborateurs(false);
        }
    }
    return { loadingCollaborateurs, errorCollaborateurs, successCollaborateurs, getCollaborateursCollection }
}


export default useCollaborateursCollection