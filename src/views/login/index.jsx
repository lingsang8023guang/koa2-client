import React, { Component } from 'react'
import { connect } from 'react-redux'
import request from '../../axios'
import { Form, Input, Button, Checkbox, message } from 'antd';
import { getIn, get } from 'immutable'
import { addUserInfo, addCookie } from './store/createType'
// import '../../login.less';
import Styles from '../../login.less';
console.log(Styles, '---000')

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
            url: '/login',  // /Connect2/ConnetionTest
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
            } else{
                message.warning(res.message)
            }
        })
      };
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };
    render() {
        return(
            // <div style={{ background: 'aliceblue', height: '100vh' }}>
            <div className={Styles.box1}>
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
            
                    <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                    <Checkbox>记住密码</Checkbox>
                    <a className="login-form-forgot" href="" style={{ float: 'right' }}>
                       忘记密码
                    </a>
                    </Form.Item>
            
                    <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                      登录
                    </Button>
                    <a href="/register">立即注册</a>
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