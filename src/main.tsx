import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'styles/global.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { App, ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import { Layout } from './layout';
import { RegisterPage } from './pages/register';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
    },
    {
        path: '/register',
        element: <RegisterPage />
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider locale={enUS}>
            <App>
                <RouterProvider router={router} />
            </App>
        </ConfigProvider>
    </StrictMode>,
)
