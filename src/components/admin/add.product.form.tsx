import { useEffect, useState } from 'react';
import { Col, Form, Input, InputNumber, Modal, Row, type UploadFile } from 'antd';
import type { FormProps } from 'antd/lib';
import { getUserRolesAPI, uploadImage } from '@/services/api';
import { UploadImg } from '@/components/upload.img';
import { v4 as uuidv4 } from 'uuid';
import type { RcFile } from 'antd/es/upload';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    refreshTable: () => void;
    currentProduct: IProduct | null;
    setCurrentProduct: (v: IProduct | null) => void;
}

export const AddProductForm = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, refreshTable, setCurrentProduct, currentProduct } = props;
    const [form] = Form.useForm<IProduct>();
    const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
    const [sliderList, setSliderList] = useState<UploadFile[]>([]);

    const handleOk = () => {
        form.submit();
    };

    const extractRcFiles = (list: UploadFile[]): RcFile[] => {
        return list
            .map(f => f.originFileObj)
            .filter((f): f is RcFile => !!f); // type predicate
    }

    const onFinish: FormProps<IProduct>['onFinish'] = async (values) => {
        console.log(values)
        // let avatar = "";
        // if (fileList && fileList.length && fileList[0].originFileObj) {
        //     const result = await uploadAvatarAPI(fileList[0].originFileObj);
        //     if (result.data) {
        //         avatar = result.data;
        //     }
        // }

        const ImageList = [
            ...extractRcFiles(thumbnailList),
            ...extractRcFiles(sliderList),
        ];

        const result = await uploadImage(ImageList);
        console.log(result);
        // const { name, email, phone, id, password, roleID } = values;
        // try {
        //     if (!currentProduct) {
        //         const result = await createUserAPI(name, email, phone, password, avatar, roleID);
        //         if (result.data) {
        //             onResetAndClose();
        //             refreshTable();
        //         }
        //     }
        //     else {
        //         const result = await updateUserAPI(name, email, phone, id, avatar, roleID);
        //         if (result.data) {
        //             onResetAndClose();
        //             refreshTable();
        //         }
        //     }
        // } catch (error) {
        //     console.error('Error details:', error);
        // }
    };

    const onFinishFailed: FormProps<IProduct>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onResetAndClose = () => {
        setIsModalOpen(false);
        form.resetFields();
        setCurrentProduct(null);
    }

    useEffect(() => {
        if (isModalOpen && currentProduct) {
            form.setFieldsValue({
                // id: currentProduct.id,
                // name: currentProduct.name,
                // email: currentProduct.email,
                // phone: currentProduct.phone,
                // roleID: currentProduct.roleID,
            });
            // setFileList([{
            //     uid: uuidv4(),
            //     name: 'img.png',
            //     status: 'done',
            //     url: import.meta.env.VITE_BACKEND_URL + '/images/' + currentProduct.avatar,
            // }])
        }
        else {
            setThumbnailList([]);
            setSliderList([])
        }
    }, [isModalOpen, currentProduct])

    return (
        <Modal
            title={currentProduct ? "Update Product Form" : "Create Product Form"}
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={onResetAndClose}
            maskClosable={false}
            okText={currentProduct ? 'Update' : 'Create'}
            destroyOnHidden={true}
            width={800}
        >
            <Form
                form={form}
                layout='vertical'
                name="Add User form"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item<IProduct>
                    label="Id"
                    name="id"
                    hidden
                >
                    <Input />
                </Form.Item>
                <Row justify={'space-between'} align={'middle'} gutter={[16, 16]}>
                    <Col span={8}>
                        <Form.Item<IProduct>
                            label="Name"
                            name="name"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item<IProduct>
                            label="Short Description"
                            name="shortDesc"
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item<IProduct>
                            label="Description"
                            name="description"
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[5, 5]}>
                    <Col span={8}>
                        <Form.Item<IProduct>
                            label="Quantity"
                            name="quantity"
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item<IProduct>
                            label="Sold"
                            name="sold"
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[5, 5]}>
                    <Col span={8}>
                        <Form.Item<IProduct>
                            label="Price"
                            name="price"
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[5, 5]}>
                    <Col span={12}>
                        <UploadImg
                            title='Thumbnails'
                            fileList={thumbnailList}
                            setFileList={setThumbnailList}
                            numberOfImages={1}
                        />
                    </Col>
                    <Col span={12}>
                        <UploadImg
                            title='Sliders'
                            fileList={sliderList}
                            setFileList={setSliderList}
                            numberOfImages={5}
                        />
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}