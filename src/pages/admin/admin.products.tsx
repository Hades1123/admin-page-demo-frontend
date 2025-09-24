import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { useRef, useState } from 'react';
import { AddUserForm } from "@/components/admin/add.user.form";
import { deleteUserByID, getAllProductsAPI, getProductByID, getUserAPI } from "@/services/api";
import { AddProductForm } from '@/components/admin/add.product.form';


export const ProductsPage = () => {
    const [isAddProductModal, setIsAddProductModal] = useState<boolean>(false);
    const [currentProduct, setcurrentProduct] = useState<null | IProduct>(null);

    const onEditUser = async (id: number) => {
        const result = await getProductByID(id);
        if (result.data) {
            setcurrentProduct(result.data);
            setIsAddProductModal(true);
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

    const columns: ProColumns<IProduct>[] = [
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
            title: 'shortDesc',
            dataIndex: 'shortDesc',
        },
        {
            title: "Quantity",
            dataIndex: 'quantity',
        },
        {
            title: "Sold",
            dataIndex: 'sold',
        },
        {
            title: "Price",
            dataIndex: 'price',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
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
            <ProTable<IProduct>
                rowKey='id'
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    const result = await getAllProductsAPI();
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
                        onClick={() => setIsAddProductModal(true)}
                    >
                        Add
                    </Button>,
                ]}
            />
            <AddProductForm
                isModalOpen={isAddProductModal}
                setIsModalOpen={setIsAddProductModal}
                refreshTable={refreshTable}
                currentProduct={currentProduct}
                setCurrentProduct={setcurrentProduct}
            />
        </>
    )
}