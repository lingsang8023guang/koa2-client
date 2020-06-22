import React, { Component } from 'react'
import request from '../../axios'
import { Form, Input, Button, Checkbox } from 'antd';
import '../../App.css';

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
            // <div style={{ background: 'aliceblue', height: '100vh' }}>
            <div className="box">
                <div style={{ width: '550px', background: '#fff', padding: '20px', position: 'fixed', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)' }}>
                    <Form
                    {...layout}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                    <Input />
                    </Form.Item>
            
                    <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码!' }]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Form.Item
                    label="确认密码"
                    name="confirmPassword"
                    rules={[{ required: true, message: '请确认密码!' }]}
                    >
                    <Input.Password />
                    </Form.Item>
            
                   <Form.Item
                    label="手机号"
                    name="phone"
                    rules={[{ required: true, message: '请输入您的手机号!' }]}
                    >
                    <Input />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                      去注册
                    </Button>
                    <a href="/login">立即登录</a>
                    </Form.Item>
                </Form>
                </div>
            </div>
        )
    }
}

export default RegisterPage