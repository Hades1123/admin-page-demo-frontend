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