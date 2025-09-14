import { useEffect } from "react"
import { CloudUploadOutlined, DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Modal, Space } from 'antd';
import { useRef, useState } from 'react';
import { AddUserForm } from "@/components/add.user.form";


export const AdminPage = () => {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<null | IUser>(null);

    const onEditUser = async (id: number) => {
        const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/users/${id}`).then(res => res);
        if (!result.ok) throw new Error('Error');
        const user: IUser = await result.json();
        setCurrentUser(user);
        setIsAddUserModalOpen(true);
    }

    const onDeleteUser = async (id: number) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/deleteUser/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(res => {
                refreshTable();
            });
        } catch (error) {
            console.log(error);
        }
    }

    const columns: ProColumns<IUser>[] = [
        {
            hidden: true,
            dataIndex: 'id',
            search: false,
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: "Phone",
            dataIndex: 'phone',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record, index) => (
                <Space size="middle">
                    <EditOutlined style={{ color: 'orange', cursor: 'pointer' }} onClick={() => onEditUser(record.id)} />
                    <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => onDeleteUser(record.id)} />
                </Space>
            ),
            search: false,
        }
    ];

    const actionRef = useRef<ActionType>();

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IUser>
                rowKey='id'
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/users`).then(res => res);
                    if (!result.ok) { throw new Error('Error') }
                    const users: IUser[] = await result.json();

                    return {
                        data: users,
                        success: true,
                    }

                }}
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setIsAddUserModalOpen(true)}
                    >
                        Add user
                    </Button>,
                ]}
            />
            <AddUserForm
                isModalOpen={isAddUserModalOpen}
                setIsModalOpen={setIsAddUserModalOpen}
                refreshTable={refreshTable}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
            />
        </>
    )
}