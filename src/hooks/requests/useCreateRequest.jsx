import { useState } from 'react';
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useCreateRequest = () => {
    const [loadingCreateRequest, setLoadingCreateRequest] = useState(false);
    const [errorCreateRequest, setErrorCreateRequest] = useState(null);
    const [successCreateRequest, setSuccessCreateRequest] = useState(null);
    const [code, setCode] = useState(null);
    const [body, setBody] = useState(null);
    const [header, setHeader] = useState([]);

    const CreateRequest = async (url, method, body, header, parameters) => {
        setLoadingCreateRequest(true);
        setErrorCreateRequest(null);
        setSuccessCreateRequest(null);

        // Vérifier les types des paramètres
        if (typeof url !== 'string') {
            setErrorCreateRequest('Invalid URL');
            setLoadingCreateRequest(false);
            return;
        }
        if (typeof method !== 'string') {
            setErrorCreateRequest('Invalid method');
            setLoadingCreateRequest(false);
            return;
        }
        if (typeof body !== 'string' && body !== null) {
            setErrorCreateRequest('Invalid body');
            setLoadingCreateRequest(false);
            return;
        }
        if (!Array.isArray(header)) {
            setErrorCreateRequest('Invalid header');
            setLoadingCreateRequest(false);
            return;
        }
        if (!Array.isArray(parameters)) {
            setErrorCreateRequest('Invalid parameters');
            setLoadingCreateRequest(false);
            return;
        }

        // Préparer les en-têtes pour la requête
        const headers = {};
        header.forEach(h => {
            headers[h.key] = h.value;
        });

        // Préparer les paramètres pour la requête
        const queryParams = new URLSearchParams();
        parameters.forEach(p => {
            queryParams.append(p.key, p.value);
        });

        // Construire l'URL avec les paramètres
        const requestUrl = `${url}?${queryParams.toString()}`;

        try {
            // Envoyer la requête au serveur avec fetch
            const response = await fetch(requestUrl, {
                method,
                headers,
                body: method !== 'GET' ? body : undefined // Le corps de la requête n'est pas utilisé pour les requêtes GET
            });

            if (!response.ok) {
                throw new Error("Error while fetching the request");
            }

            // Préparer les en-têtes de la réponse
            const responseHeaders = [];
            response.headers.forEach((value, key) => {
                responseHeaders.push({ key, value });
            });
            setCode(response.status);
            setHeader(responseHeaders);
            setBody(await response.text());
            setSuccessCreateRequest("Request sent successfully");
        } catch (error) {
            setErrorCreateRequest(error.message);
            toast.error(error.message);
        } finally {
            setLoadingCreateRequest(false);
        }
    };

    return { loadingCreateRequest, errorCreateRequest, successCreateRequest, CreateRequest, code, body, header };
};

export default useCreateRequest;