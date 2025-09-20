import { createUserAPI } from '@/services/api';
import type { FormProps } from 'antd';
import { App, Button, Col, Form, Input, Row } from 'antd';
import { Link } from 'react-router-dom';

type FieldType = Omit<IUser, 'avatar' | 'id'>;


export const LoginPage = () => {
    const { message } = App.useApp();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        const { email, name, phone, password } = values;
        const result = await createUserAPI(name, email, phone, password);
        if (result.data) {
            message.success('Register successfully !!!');
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Row align={'middle'} justify={'center'} style={{ height: "100vh" }}>
                <Col span={12} className='flex justify-center'>
                    <fieldset className='p-8 border-2 border-gray-200 rounded-lg'>
                        <legend className='p-2 border-2 border-sky-300 bg-sky-200 rounded-lg'>Register</legend>
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            layout='vertical'
                            style={{ width: 400 }}
                        >
                            <Form.Item<FieldType>
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Phone"
                                name="phone"
                                rules={[{ required: true, message: 'Please input your phone!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Button type='primary' htmlType='submit' style={{ width: '100%', marginTop: 10 }}>Register</Button>
                            or <Link to={'/'} className='text-red-300'>Go to homepage</Link>
                        </Form>
                    </fieldset>
                </Col>
            </Row>
        </>

    );
}
