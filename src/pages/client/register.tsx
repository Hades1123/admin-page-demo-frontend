import { createUserAPI, registerAPI } from '@/services/api';
import type { FormProps } from 'antd';
import { App, Button, Col, Form, Input, Row } from 'antd';
import { Link } from 'react-router-dom';

type FieldType = Omit<IUser, 'avatar' | 'id'>;


export const RegisterPage = () => {
    const { message, notification } = App.useApp();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { email, name, password, confirmPassword, phone } = values;
        const result = await registerAPI(name, email, password, confirmPassword!, phone);
        if (result.success) {
            message.success('Register successfully !!!');
        }
        else {
            notification.error({
                message: 'Error',
                description: (
                    <div>
                        {result.error?.message.map((msg: string, i: number) => (
                            <div key={i} className='font-bold'>{msg}</div>
                        ))}
                    </div>
                ),
            })
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
                                validateFirst
                                rules={[
                                    { required: true, message: 'Please input your name!' },
                                    {
                                        validator: (_, value) => {
                                            const formatValue = (value as string).trim();
                                            if (formatValue.length <= 2) {
                                                return Promise.reject("Name's length must greater than 2");
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your email!' },
                                    {
                                        type: 'email',
                                        message: 'Invalid email format',
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item<FieldType>
                                label="Phone"
                                name="phone"
                                validateFirst
                                rules={[
                                    { required: true, message: 'Please input your phone!' },
                                    {
                                        validator: (_, value) => {
                                            if (isNaN(Number(value)) || (value as string).length != 10) {
                                                return Promise.reject('Invalid phone number');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Password"
                                name="password"
                                validateFirst
                                rules={[
                                    { required: true, message: 'Please input your password!' },
                                    {
                                        validator(_, value) {
                                            if (!/^(?=.*\d).+$/.test(value)) {
                                                return Promise.reject('Must contain at least one digit');
                                            }
                                            if (!/^(?=.*[A-Z]).+$/.test(value)) {
                                                return Promise.reject('Must contain at least one uppercase letter');
                                            }
                                            if (!/^(?=.*[^A-Za-z0-9]).+$/.test(value)) {
                                                return Promise.reject('Must contain at least one special character');
                                            }
                                            if ((value as string).length <= 8) {
                                                return Promise.reject('password length must greater than 8')
                                            }
                                            return Promise.resolve();
                                        },
                                    }
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Confirm password"
                                name="confirmPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Confirm password is required'
                                    }
                                ]}
                            >
                                <Input.Password />
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
