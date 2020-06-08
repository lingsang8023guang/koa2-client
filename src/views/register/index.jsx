import React, { Component } from 'react'
import request from '../../axios'
import { Form, Input, Button, Checkbox } from 'antd';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 18 },
  };
class RegisterPage extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    onFinish = values => {
        request({
            method: 'POST',
            url: '/register',  // /Connect2/ConnetionTest
            data: {
                name: values.username,
                password: values.password,
                confirmPassword: values.confirmPassword,
                phone: values.phone,
            }
        }).then((res) => {
            console.log(res, '--res');
            if (res.code === '000') {
                // this.props.onLogin(values.username);
                // this.props.setCookie();
                this.props.history.push('/login')
            }
        })
      };
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };
    render() {
        return(
            <div style={{ background: '#000', height: '100vh' }}>
                <div style={{ width: '550px', background: '#94e694', padding: '20px', position: 'fixed', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)' }}>
                    <Form
                    {...layout}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                    <Input />
                    </Form.Item>
            
                    <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Form.Item
                    label="confirmPassword"
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Please confirm input your password!' }]}
                    >
                    <Input.Password />
                    </Form.Item>
            
                   <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please input your phone!' }]}
                    >
                    <Input />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                      Go Regester
                    </Button>
                    </Form.Item>
                </Form>
                </div>
            </div>
        )
    }
}

export default RegisterPage