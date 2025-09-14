import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'styles/global.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AdminPage } from './pages/admin';
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';

const router = createBrowserRouter([
    {
        path: "/",
        element: <AdminPage />,
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider locale={enUS}>
            <RouterProvider router={router} />
        </ConfigProvider>
    </StrictMode>,
)
