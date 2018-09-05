import React from 'react'
import StandardPage from '../../StandardPage';
import { Table, Icon, Row, Col, Button} from 'antd'
import I18N from '@/I18N'
import config from '@/config'

import './style.scss'
import moment from 'moment/moment'

export default class extends StandardPage {

    constructor(p){
        super(p);

        this.state.list = [];
    }

    ord_renderContent () {
        const map = {
            '1' : 'New Motion',
            '2' : 'Motion against any existing motion',
            '3' : 'Anyting else'
        };

        const columns = [
        // {
        //     title: 'No.',
        //     dataIndex: '_id',
        //     render: (id, item, index) => {
        //         return (<a className="tableLink">{index + 1}</a>)
        //     }
        // },
        {
            title : 'Title',
            dataIndex : 'title',
            render: (title, item) => {
                return (<a onClick={this.toDetail.bind(this, item._id)} className="tableLink">{title}</a>)
            }
        },
        {
            title : 'Type',
            dataIndex : 'type',
            render: (type, item) => {
                return map[type];
            }
        },
        {
            title : 'Author',
            dataIndex : 'createdBy',
            render : (item, data)=>{
                return item || '';
            }
        },
        {
            title : 'Create Time',
            dataIndex : 'createdAt',
            render: (createdAt) => moment(createdAt).format('MMM D'),
        },
        {
            title : 'Update Time',
            dataIndex : 'updatedAt',
            render: (updatedAt) => moment(updatedAt).format('MMM D'),
        }
        ]

      

        return (
            <div className="p-cvote-list ebp-wrap">
                <div className="ebp-header-divider" />
                <div className="d_box">
                    <Row>
                        <Col span={8}>
                            <h3 style={{textAlign:'left'}}>Proposal List</h3>
                        </Col>
                        <Col span={8} offset={8}>
                            <Button style={{width:'100%'}} onClick={this.toCreate.bind(this)} size="large" type="ebp" htmlType="submit" className="d_btn">
                                Create New Proposal
                            </Button>
                        </Col>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={this.state.list}
                        rowKey={record => record._id}
                        loading={this.props.loading}
                    />
                </div>
            </div>
            
        )
    }

    toDetail(id) {
        this.props.history.push(`/cvote/edit/${id}`);
    }
    toCreate(){
        this.props.history.push('/cvote/create');
    }

    async componentDidMount(){
        super.componentDidMount();
        if(this.props.isLogin){
            const list = await this.props.listData({});
      
            this.setState({list});
        }
        else{
            // this.props.history.replace('/login');
        }
      
    }

    ord_checkLogin(isLogin){
        console.log(isLogin)
        if(!isLogin){
            this.props.history.replace('/login');
        }
    }
}
