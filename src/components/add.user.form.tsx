import { useEffect, useState } from 'react';
import { Col, Form, Input, Modal, Row, Select, type UploadFile } from 'antd';
import type { FormProps } from 'antd/lib';
import { createUserAPI, getUserRolesAPI, updateUserAPI, uploadAvatarAPI } from '@/services/api';
import { UploadImg } from './upload.img';
import { v4 as uuidv4 } from 'uuid';

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
    const [roles, setRoles] = useState<{ value: number, label: string }[]>([]);

    const handleOk = () => {
        form.submit();
    };

    const onFinish: FormProps<IUser>['onFinish'] = async (values) => {
        console.log(values)
        let avatar = "";
        if (fileList && fileList.length && fileList[0].originFileObj) {
            const result = await uploadAvatarAPI(fileList[0].originFileObj);
            if (result.data) {
                avatar = result.data;
            }
        }

        const { name, email, phone, id, password, roleID } = values;
        try {
            if (!currentUser) {
                const result = await createUserAPI(name, email, phone, password, avatar, roleID);
                if (result.data) {
                    onResetAndClose();
                    refreshTable();
                }
            }
            else {
                const result = await updateUserAPI(name, email, phone, id, avatar, roleID);
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
        setIsModalOpen(false);
        form.resetFields();
        setCurrentUser(null);
    }

    useEffect(() => {
        if (isModalOpen && currentUser) {
            form.setFieldsValue({
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                phone: currentUser.phone,
                roleID: currentUser.roleID,
            });
            setFileList([{
                uid: uuidv4(),
                name: 'img.png',
                status: 'done',
                url: import.meta.env.VITE_BACKEND_URL + '/images/' + currentUser.avatar,
            }])
        }
        else {
            setFileList([]);
        }
    }, [isModalOpen, currentUser])

    useEffect(() => {
        const loadRoles = async () => {
            const result = await getUserRolesAPI();
            if (result.data) {
                setRoles(result.data.map(item => {
                    return {
                        label: item.name,
                        value: item.id,
                    }
                }));
            }
        }
        loadRoles();
    }, [])

    return (
        <Modal
            title={currentUser ? "Update User Form" : "Create User Form"}
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={onResetAndClose}
            maskClosable={false}
            okText={currentUser ? 'Update' : 'Create'}
            destroyOnHidden={true}
            width={400}
        >
            <Form
                form={form}
                layout='vertical'
                name="Add User form"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <UploadImg
                            fileList={fileList}
                            setFileList={setFileList}
                        />
                    </Col>
                </Row>

                <Row justify={'space-between'}>
                    <Col span={24}>
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
                    </Col>
                    <Col span={24}>
                        <Form.Item<IUser>
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={14}>
                        <Form.Item<IUser>
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input your phone!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item<IUser>
                            label="Role"
                            name="roleID"
                            rules={[{ required: true, message: 'Please input your role!' }]}
                        >
                            <Select
                                defaultValue={currentUser?.roleID ?? "None"}
                                options={roles}
                                value={currentUser?.roleID ?? -1}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}