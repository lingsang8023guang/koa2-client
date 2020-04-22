import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Checkbox } from 'antd';
import { getIn, get } from 'immutable'
import { addUserInfo } from './store/createType'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return(
            <div>
              <h1>Login</h1>
              <div></div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    console.log(state.login.get('userName'), '--state')
    return {
        userName: state.login.get('userName')
    }
}
function mapDispatchToProps(dispatch) {
    return {
      onLogin: (name) => {
          return dispatch(addUserInfo(name))
      }
    }
  }
export default connect(mapStateToProps, mapDispatchToProps)(Login)