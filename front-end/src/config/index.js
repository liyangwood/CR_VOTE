import _ from 'lodash';
import router from './router';

export default {
    router,
    ...process.env,
    
    FORMAT : {
        DATE : 'MM/DD/YYYY',
        TIME : 'MM/DD/YYYY hh:mm:ss'
    }
};
