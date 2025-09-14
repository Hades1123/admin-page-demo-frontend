import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { useRef, useState } from 'react';
import { AddUserForm } from "@/components/add.user.form";
import { deleteUserByID, getUserAPI, getUserByID } from "@/services/api";


export const AdminPage = () => {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<null | IUser>(null);

    const onEditUser = async (id: number) => {
        const result = await getUserByID(id);
        if (result.data) {
            setCurrentUser(result.data);
            setIsAddUserModalOpen(true);
        }
    }

    const onDeleteUser = async (id: number) => {
        try {
            const result = await deleteUserByID(id);
            if (result.data) {
                refreshTable();
            }
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
                    const result = await getUserAPI();
                    return {
                        data: result.data,
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
                    <Button
                        onClick={() => {
                            async function getMessage() {
                                try {
                                    const response = await getUserAPI();
                                    console.log(response);
                                }
                                catch (error) {
                                    console.error(error);
                                }
                            }
                            getMessage();
                        }}
                    >
                        Click me
                    </Button>
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