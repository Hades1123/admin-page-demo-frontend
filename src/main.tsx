import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'styles/global.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { App, ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import { RegisterPage } from 'pages/client/register';
import { AdminLayout } from 'pages/admin/admin.layout';
import { DashboardPage } from '@/pages/admin/admin.dashboard';
import { UsersPage } from 'pages/admin/admin.users';
import { LoginPage } from 'pages/client/login';
import { ProductsPage } from './pages/admin/admin.products';
import { RevenuePage } from './pages/admin/admin.revenue';

const router = createBrowserRouter([
    {
        path: "/",
        element: <div>This is empty page</div>,
    },
    {
        path: '/register',
        element: <RegisterPage />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/admin',
        Component: AdminLayout,
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: 'dashboard', Component: DashboardPage },
            { path: 'revenue', Component: RevenuePage },
            { path: 'users', Component: UsersPage },
            { path: 'products', Component: ProductsPage }
        ]
    },
    {
        path: '/users',
        element: <div>This is users page</div>
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
