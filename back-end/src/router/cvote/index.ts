import Base from '../Base';

import create from './create';
import list from './list';
import get from './get';
import update from './update';

export default Base.setRouter([
    {
        path : '/create',
        router : create,
        method : 'post'
    },
    {
        path : '/list',
        router : list,
        method : 'get'
    },
    {
        path : '/get/:id',
        router : get,
        method : 'get'
    },
    {
        path : '/update',
        router : update,
        method : 'post'
    }
]);