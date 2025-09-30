import type { RcFile } from 'antd/es/upload';
import axios from '@/services/axios.customize'

export const getUserAPI = () => {
    return axios.get<ApiResponse<IUser[]>>('/admin/users');
}

export const getUserByID = (id: number) => {
    return axios.get<ApiResponse<IUser>>(`/admin/users/${id}`);
}

export const createUserAPI = (name: string, email: string, phone: string, password: string, avatar?: string, roleID?: number) => {
    return axios.post<ApiResponse<IUser>>('/admin/users', { name, email, phone, password, avatar, roleID });
}

export const updateUserAPI = (name: string, email: string, phone: string, id: number, avatar: string, roleID: number) => {
    return axios.put<ApiResponse<IUser>>(`/admin/users/${id}`, { name, email, phone, avatar, roleID });
}

export const deleteUserByID = (id: number) => {
    return axios.delete<ApiResponse<IUser>>(`/admin/deleteUser/${id}`);
}

export const uploadAvatarAPI = (file: RcFile) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return axios.post<ApiResponse<string>>(`/admin/uploadAvatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
}

export const getUserRolesAPI = () => {
    return axios.get<ApiResponse<{ id: number, name: string }[]>>('/admin/userRoles');
}

export const registerAPI = (name: string, email: string, password: string, confirmPassword: string, phone: string) => {
    return axios.post<ApiResponse<IUser>>('/register', {
        email, password, confirmPassword, phone, name
    });
}

export const getAllProductsAPI = () => {
    return axios.get<ApiResponse<IProduct[]>>('/products');
}

export const getProductByID = (id: number) => {
    return axios.get<ApiResponse<IProduct>>(`/products/${id}`);
}

export const uploadImage = (fileList: RcFile[]) => {
    const formData = new FormData();
    fileList.forEach(item => {
        formData.append('image', item);
    })
    return axios.post<ApiResponse<string>>(`/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
}

export const loginAPI = async (email: string, password: string) => {
    const result = await fetch('http://localhost:8080/login', {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return result.json();
}