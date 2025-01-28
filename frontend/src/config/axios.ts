
import axios from 'axios';
import { config } from './config';

const ApiClient = ({ token }: { token: string }) => {


    const { baseURL } = config

    const defaultOptions = {
        baseURL,
        timeout: 150000,
    };

    const instance = axios.create(defaultOptions);

    instance.interceptors.request.use(async (request) => {
        // const sessionId = await getServerSession(options);

        request.headers.Authorization = `Bearer ${token}`;

        return request;
    });

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
    );

    return instance;
};

export default ApiClient;
