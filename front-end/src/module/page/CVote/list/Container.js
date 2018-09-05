import { createContainer, api_request } from '@/util'
import Component from './Component'

export default createContainer(Component, (state) => {
    return {}
}, ()=>{
    return {
        async listData(param){
            const rs = await api_request({
                path : '/api/cvote/list',
                method : 'get',
                data : param
            });
            
            return rs;
        }
    }
})
