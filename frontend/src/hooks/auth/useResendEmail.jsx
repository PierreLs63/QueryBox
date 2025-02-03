import { toast } from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useResendEmail = () => {

    const api = `${baseURL}/auth/verification-email`;
    
    const resendMail = async () => {

        try {
            const response = await fetch(api, {
                method: 'POST'
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

        } catch (error) {
           toast.error(error.message);
        }

    }

    return { resendMail }
};

export default useResendEmail;