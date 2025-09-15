import { useEffect, useState } from 'react';
import { Form, Image, Input, Modal, type UploadFile } from 'antd';
import type { FormProps } from 'antd/lib';
import { createUserAPI, updateUserAPI, uploadAvatarAPI } from '@/services/api';
import { UploadImg } from './upload.img';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    refreshTable: () => void;
    currentUser: IUser | null;
    setCurrentUser: (v: IUser | null) => void;
}

export const AddUserForm = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, refreshTable, setCurrentUser, currentUser } = props;
    const [form] = Form.useForm<IUser>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);

    const handleOk = () => {
        form.submit();
    };

    const onFinish: FormProps<IUser>['onFinish'] = async (values) => {
        console.log('Success:', values);
        console.log(fileList);
        let avatar = "";
        if (fileList && fileList.length && fileList[0].originFileObj) {
            const result = await uploadAvatarAPI(fileList[0].originFileObj);
            if (result.data) {
                avatar = result.data;
            }
        }
        const { name, email, phone, id } = values;
        try {
            if (!currentUser) {
                const result = await createUserAPI(name, email, phone);
                if (result.data) {
                    onResetAndClose();
                    refreshTable();
                }
            }
            else {
                const result = await updateUserAPI(name, email, phone, id, avatar);
                if (result.data) {
                    onResetAndClose();
                    refreshTable();
                }
            }
        } catch (error) {
            console.error('Error details:', error);
        }
    };

    const onFinishFailed: FormProps<IUser>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onResetAndClose = () => {
        form.resetFields();
        setIsModalOpen(false);
        setCurrentUser(null);
    }

    useEffect(() => {
        if (isModalOpen && currentUser) {
            form.setFieldsValue({
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                phone: currentUser.phone,
            });
            setCurrentAvatar(currentUser.avatar);
        }
    }, [isModalOpen, currentUser])

    return (
        <Modal
            title={currentUser ? "Update User Form" : "Create User Form"}
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={onResetAndClose}
            maskClosable={false}
            okText={currentUser ? 'Update' : 'Create'}
        >
            <Form
                form={form}
                layout='vertical'
                name="Add User form"
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item<IUser>
                    label="Id"
                    name="id"
                    hidden
                >
                    <Input />
                </Form.Item>

                <Form.Item<IUser>
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<IUser>
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<IUser>
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please input your phone!' }]}
                >
                    <Input />
                </Form.Item>

                {currentAvatar &&
                    <Image
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/${currentAvatar}`}
                        width={100}
                    />}
                <UploadImg
                    fileList={fileList}
                    setFileList={setFileList}
                />
            </Form>
        </Modal>
    )
}