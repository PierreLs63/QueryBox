//je veux créer un hook pour récupérer les collections d'un workspace donné avec comme paramètre le workspaceId
import { useState } from 'react'
import toast from 'react-hot-toast';
import dotenv from 'dotenv';
dotenv.config();

const useCollections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [workspaceId, setWorkspaceId] = useState(null);

    const getCollections = async (workspaceId) => {
        if (!workspaceId) return;
        setWorkspaceId(workspaceId);
        setLoading(true);
        setError(null);
        try {
            //eslint-disable-next-line no-undef
            const response = await fetch(`${process.env.REACT_APP_API_URL}/workspaces/${workspaceId}/collections`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setCollections(data.collections);
        }
        catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    return { collections, loading, error, getCollections, workspaceId }
}

export default useCollections
