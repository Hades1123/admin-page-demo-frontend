export { }
declare global {
    interface ApiResponse<T> {
        success: boolean,
        data?: T;
        error?: {
            message: string,
        }
        status?: number,
    }
    interface IUser {
        id: number,
        name: string,
        email: string,
        phone: string,
        password: string,
        avatar: string,
        roleID: number,
    }
}