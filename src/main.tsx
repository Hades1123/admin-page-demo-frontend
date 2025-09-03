import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'styles/global.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <div className='text-red-500'>Hello World</div>,
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />,
    </StrictMode>,
)
