import { loginAPI } from '@/services/api';
import type { FormProps } from 'antd';
import { App, Button, Col, Form, Input, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

type FieldType = Pick<IUser, 'password' | 'email'>;


export const LoginPage = () => {
    // const { message, notification } = App.useApp();
    const navigate = useNavigate();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const result = await loginAPI(values.email, values.password);
        localStorage.setItem('access_token', result.data.access_token);
        navigate('/');
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Row align={'middle'} justify={'center'} style={{ height: "100vh" }}>
                <Col span={12} className='flex justify-center'>
                    <fieldset className='p-8 border-2 border-gray-200 rounded-lg'>
                        <legend className='p-2 border-2 border-sky-300 bg-sky-200 rounded-lg'>Login</legend>
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            layout='vertical'
                            style={{ width: 400 }}
                        >
                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                                validateFirst
                                rules={[
                                    {
                                        required: true,
                                        message: 'The email is required.',
                                    },
                                    {
                                        validator: (_, value) => {
                                            if (/(?:[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+(?:\.[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9\x2d]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(value)) {
                                                return Promise.resolve();
                                            } else {
                                                return Promise.reject('Invalid email format');
                                            }
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
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Button type='primary' htmlType='submit' style={{ width: '100%', marginTop: 10 }}>Login</Button>
                            or <Link to={'/register'} className='text-red-300'>Register now !</Link>
                        </Form>
                    </fieldset>
                </Col>
            </Row>
        </>

    );
}
