import React, { Component } from 'react'
import { connect } from 'react-redux'
import request from '../../axios'
import { Form, Input, Button, Checkbox } from 'antd';
import { getIn, get } from 'immutable'
import { addUserInfo, addCookie } from './store/createType'

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 18 },
  };
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    onFinish = values => {
        request({
            method: 'POST',
            url: 'http://localhost:4000/login',
            data: {
                name: values.username,
                password: values.password,
            }
        }).then((res) => {
            console.log(res, '--res');
            if (res.code === '000') {
                this.props.onLogin(values.username);
                this.props.setCookie();
                this.props.history.push('/main')
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
            
                    <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                    <a className="login-form-forgot" href="" style={{ float: 'right' }}>
                       Forgot password
                    </a>
                    </Form.Item>
            
                    <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                      Log in
                    </Button>
                    Or <a href="">register now!</a>
                    </Form.Item>
                </Form>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    console.log(state.login.get('userName'), '--userName')
    console.log(state, '--state');
    return {
        userName: state.login.get('userName')
    }
}
function mapDispatchToProps(dispatch) {
    return {
      onLogin: (name) => {
          return dispatch(addUserInfo(name))
      },
      setCookie: () => {
          dispatch(addCookie())
        }
    }
  }
export default connect(mapStateToProps, mapDispatchToProps)(Login)