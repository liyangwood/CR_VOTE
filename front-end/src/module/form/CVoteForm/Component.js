import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Form, Icon, Input, Button, Checkbox, Select, Row, Col, message} from 'antd'
import I18N from '@/I18N'
import _ from 'lodash';

import './style.scss'

const FormItem = Form.Item;
const TextArea = Input.TextArea

class C extends BaseComponent {

    constructor(props) {
        super(props)

        this.state = {
            persist: true
        }
    }

    async handleSubmit(e) {
        e.preventDefault()

        const s = this.props.static;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log(' ===> ', values)

                const param = {
                    title : values.title,
                    type : values.type,
                    notes : values.notes,
                    motionId : values.motionId,
                    isConflict : values.isConflict,
                    proposedBy : values.proposedBy,
                    content : values.content
                };
                var x1 = [];
                var x2 = [];
                _.each(s.voter, (n)=>{
                    const name = n.value;
                    x1.push(name+'|'+values['vote_'+name]);
                    x2.push(name+'|'+values['reason_'+name]);
                });
                param.vote_map = x1.join(',');
                param.reason_map = x2.join(',');

                console.log(param);

                if(this.props.edit){
                    param._id = this.props.edit;
                    await this.props.updateCVote(param);
                    message.success('update success');
                    this.props.history.push('/cvote/list');
                }
                else{
                    await this.props.createCVote(param);
                    message.success('create success');
                    this.props.history.push('/cvote/list');
                }

                
            }
        })
    }

    getInputProps(data) {
        const edit = this.props.edit;
        const isAdmin = this.props.user.role === 'ADMIN';
        const dis = {};
        if(!isAdmin){
            dis.disabled = true;
        }

        const s = this.props.static;
        const {getFieldDecorator} = this.props.form;
        const type_fn = getFieldDecorator('type', {
            rules: [{required: true}],
            disabled: true,
            initialValue: edit ? parseInt(data.type, 10) : ''
        })
        const type_el = (
            <Select size="large" {...dis}>
                {/* <Select.Option key={-1} value={-1}>please select type</Select.Option> */}
                {
                    _.map(s.select_type, (item, i)=>{
                        return (
                            <Select.Option key={i} value={item.code}>{item.name}</Select.Option>
                        );
                    })
                }
            </Select>
        );

        const title_fn = getFieldDecorator('title', {
            rules : [{required : true}],
            initialValue : edit ? data.title : ''
        });
        const title_el = (
            <Input {...dis} size="large" type="text" />
        );

        const content_fn = getFieldDecorator('content', {
            rules : [{required : true}],
            initialValue : edit ? data.content : ''
        });
        const content_el = (
            <TextArea {...dis} rows={6}></TextArea>
        );

        const proposedBy_fn = getFieldDecorator('proposedBy', {
            rules : [{required : true}],
            initialValue : edit ? data.proposedBy : -1
        });
        const proposedBy_el = (
            <Select {...dis} size="large">
                <Select.Option key={-1} value={-1}>please select</Select.Option>
                {
                    _.map(s.voter, (item, i)=>{
                        return (
                            <Select.Option key={i} value={item.value}>{item.value}</Select.Option>
                        );
                    })
                }
            </Select>
        );

        const motionId_fn = getFieldDecorator('motionId', {
            initialValue : edit ? data.motionId : ''
        });
        const motionId_el = (
            <Input {...dis} size="large" type="text" />
        );

        const vtt = {};
        _.each(s.voter, (item)=>{
            const name = item.value;

            
            const fn = getFieldDecorator('vote_'+name, {
                initialValue : edit ? data.vote_map[name] : -1
            });
            const el = (
                <Select {...dis} size="large">
                    <Select.Option key={-1} value={-1}>please select</Select.Option>
                    {
                        _.map(s.select_vote, (item, i)=>{
                            return (
                                <Select.Option key={i} value={item.value}>{item.name}</Select.Option>
                            );
                        })
                    }
                </Select>
            );
            vtt['vote_'+name] = fn(el);
        });

        const vts = {};
        _.each(s.voter, (item)=>{
            const name = item.value;

            const fn = getFieldDecorator('reason_'+name, {
                initialValue : edit ? data.reason_map[name] : ''
            });
            const el = (
                <TextArea {...dis} rows={4}></TextArea>
            );
            vts['reason_'+name] = fn(el);
        });

        const isConflict_fn = getFieldDecorator('isConflict', {
            initialValue : edit ? data.isConflict : 'NO'
        });
        const isConflict_el = (
            <Select {...dis} size="large">
                <Select.Option value={'NO'}>NO</Select.Option>
                <Select.Option value={'YES'}>YES</Select.Option>
            </Select>
        );
        
        const notes_fn = getFieldDecorator('notes', {
            initialValue : edit ? data.notes : ''
        });
        const notes_el = (
            <TextArea rows={4}></TextArea>
        );

        return {
            type : type_fn(type_el),
            title : title_fn(title_el),
            content : content_fn(content_el),
            proposedBy : proposedBy_fn(proposedBy_el),
            motionId : motionId_fn(motionId_el),
            ...vtt,
            ...vts,
            isConflict : isConflict_fn(isConflict_el),
            notes : notes_fn(notes_el)
        }
    }

    togglePersist() {
        this.setState({persist: !this.state.persist})
    }

    ord_render() {
        let p = null;
        if(this.props.edit && !this.props.data){
            return null;
        }
        if(this.props.edit && this.props.data){
            p = this.getInputProps(this.props.data);
        }
        else{
            p = this.getInputProps();
        }
        const s = this.props.static;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12}
            },
        }
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="c_loginForm">
                <h2>
                    Cyber Republic Council Members Proposal Form
                </h2>

                <h5>
                    Cyber Republic Council members can use this form to propose motion. All Cyber Republic citizen can view and share their own idea (offline). All proposals will be discussed in regular council meetings. All results will be disclosed to the public. This is a temporary solution before our Cyber Republic website has such a feature.
                </h5>

                <FormItem style={{marginTop: '24px'}} label="Type" {...formItemLayout}>{p.type}</FormItem>
                <FormItem label="Title" {...formItemLayout}>{p.title}</FormItem>
                <FormItem label="Content" {...formItemLayout}>{p.content}</FormItem>
                <FormItem label="Proposed by" {...formItemLayout}>{p.proposedBy}</FormItem>

                <FormItem style={{'marginBottom':'30px'}} label='Motion' help='If this is a motion against existing motion, refer to existing motion #' {...formItemLayout}>{p.motionId}</FormItem>

                {
                    _.map(s.voter, (item, i)=>{
                        const name = item.value;
                        return (
                            <FormItem key={i} label={`Online Voting by ${name}`} {...formItemLayout}>{p['vote_'+name]}</FormItem>
                        );
                    })
                }

                {
                    _.map(s.voter, (item, i)=>{
                        const name = item.value;
                        return (
                            <FormItem key={i} label={`Reasons from ${name} if against`} {...formItemLayout}>{p['reason_'+name]}</FormItem>
                        );
                    })
                }

                <FormItem style={{'marginBottom':'12px'}} label="Conflict?" help="Is this proposal potentially conflict with existing constitution?" {...formItemLayout}>{p.isConflict}</FormItem>
                <FormItem label="Notes from Secretary" {...formItemLayout}>{p.notes}</FormItem>
                
                <Row>
                    <Col offset={6} span={12}>
                        <FormItem>
                            <Button loading={this.props.loading} size="large" type="ebp" htmlType="submit" className="d_btn">
                                Submit
                            </Button>
                        </FormItem>
                    </Col>
                </Row>
                
                
            </Form>
        )
    }
}

export default Form.create()(C)
