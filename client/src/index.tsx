import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {QueryClient, QueryClientProvider} from "react-query";
import moment from "moment";
import axios from "axios";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        }
    }
})

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

function setupAxios(axios: any) {
    const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

    function isIsoDateString(value: any): boolean {
        return value && typeof value === "string" && isoDateFormat.test(value);
    }

    function handleDates(body: any) {
        if (body === null || body === undefined || typeof body !== "object")
            return body;

        for (const key of Object.keys(body)) {
            const value = body[key];
            if (isIsoDateString(value)) {
                body[key] = moment(value);
            } else if (typeof value === "object") handleDates(value);
        }
    }

    axios.defaults.headers.Accept = 'application/json'

    axios.interceptors.response.use((originalResponse: any) => {
        handleDates(originalResponse.data);
        return originalResponse;
    });

}

setupAxios(axios)

root.render(
    <>
        <QueryClientProvider client={queryClient}>
            <App/>
            <ToastContainer/>
        </QueryClientProvider>
    </>
);
