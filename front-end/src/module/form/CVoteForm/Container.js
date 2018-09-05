import {createContainer, goPath, api_request} from "@/util"
import Component from './Component'
import UserService from '@/service/UserService'
import {message} from 'antd'



export default createContainer(Component, (state) => {
    return {
        user : state.user,
        static : {
            voter : [
                {value : 'Yipeng Su'},
                {value : 'Fay Li'},
                {value : 'Kevin Zhang'}
            ],
            select_type : [
                {name : 'New Motion', code : 1},
                {name : 'Motion against any existing motion', code : 2},
                {name : 'Anyting else', code : 3}
            ],
            select_vote : [
                {name : 'Support', value : 'support'},
                {name : 'Reject', value : 'reject'},
                {name : 'Abstention', value : 'abstention'}
            ]
        }
    }
}, () => {
    return {
        async createCVote(param){
            const rs = await api_request({
                path : '/api/cvote/create',
                method : 'post',
                data : param
            });
            console.log(rs);
            return rs;
        },
        async updateCVote(param){
            const rs = await api_request({
                path : '/api/cvote/update',
                method : 'post',
                data : param
            });
            return rs;
        }
    }
})