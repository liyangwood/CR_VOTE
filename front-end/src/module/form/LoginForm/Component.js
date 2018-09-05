import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Form, Icon, Input, Button, Checkbox} from 'antd'
import I18N from '@/I18N'

import './style.scss'

const FormItem = Form.Item

class C extends BaseComponent {

    constructor(props) {
        super(props)

        this.state = {
            persist: true
        }
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.login(values.username, values.password, this.state.persist)

            }
        })
    }

    getInputProps() {
        const {getFieldDecorator} = this.props.form
        const userName_fn = getFieldDecorator('username', {
            rules: [{required: true, message: I18N.get('login.label_username')}],
            initialValue: ''
        })
        const userName_el = (
            <Input size="large"
                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                placeholder={I18N.get('login.username')}/>
        )

        const pwd_fn = getFieldDecorator('password', {
            rules: [{required: true, message: I18N.get('login.label_password')}]
        })
        const pwd_el = (
            <Input size="large"
                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                type="password" placeholder={I18N.get('login.password')}/>
        )

        const persist_fn = getFieldDecorator('persist')
        const persist_el = (
            <Checkbox onClick={this.togglePersist.bind(this)} checked={this.state.persist}>{I18N.get('login.logged')}</Checkbox>
        )

        return {
            userName: userName_fn(userName_el),
            pwd: pwd_fn(pwd_el),
            persist: persist_fn(persist_el)
        }
    }

    togglePersist() {
        this.setState({persist: !this.state.persist})
    }

    ord_render() {
        const p = this.getInputProps()
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="c_loginForm">
                <h2>
                    {I18N.get('login.title')}
                </h2>

                <h5>
                    {I18N.get('login.description_1')}
                </h5>

                <FormItem>
                    {p.userName}
                </FormItem>
                <FormItem>
                    {p.pwd}
                </FormItem>
                <FormItem>
                    {p.persist}
                </FormItem>
                {/* <FormItem className="d_item">
                    <a className="login-form-forgot" onClick={() => this.props.history.push('/forgot-password')}>{I18N.get('login.forget')}</a>
                </FormItem> */}
                <FormItem>
                    <Button loading={this.props.loading} type="ebp" htmlType="submit" className="d_btn">
                        {I18N.get('login.submit')}
                    </Button>
                </FormItem>
                {/* <FormItem>
                    <Button onClick={() => this.props.history.push('/register')} type="ebp" htmlType="button" className="d_btn">
                        Don't have an account? Click here to register.
                    </Button>
                </FormItem> */}
            </Form>
        )
    }
}

export default Form.create()(C)
