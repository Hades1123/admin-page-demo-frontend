import axios from './axios.customize'

export const getUserAPI = () => {
    return axios.get<ApiResponse<IUser[]>>('/admin/users');
}

export const getUserByID = (id: number) => {
    return axios.get<ApiResponse<IUser>>(`/admin/users/${id}`);
}

export const createUserAPI = (name: string, email: string, phone: string) => {
    return axios.post<ApiResponse<IUser>>('/admin/users', { name, email, phone });
}

export const updateUserAPI = (name: string, email: string, phone: string, id: number) => {
    return axios.put<ApiResponse<IUser>>(`/admin/users/${id}`, { name, email, phone });
}

export const deleteUserByID = (id: number) => {
    return axios.delete<ApiResponse<IUser>>(`/admin/deleteUser/${id}`);
}