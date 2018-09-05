import {createContainer, goPath} from "@/util"
import Component from './Component'
import UserService from '@/service/UserService'
import {message} from 'antd'
import I18N from '@/I18N'

message.config({
    top: 100
})


export default createContainer(Component, (state) => {
    return {
        user : state.user,
        ...state.user.login_form,
        language: state.language
    }
}, () => {
    const userService = new UserService()

    return {
        async resetPassword(username, password) {
            try {
                const rs = await userService.changePassword(username, password)

                if (rs) {
                    message.success(I18N.get('forgot.success'))
                    await userService.logout();
                    this.history.push('/login')
                }

            } catch (err) {
                console.error(err)
                message.error(err.message)
            }
        }
    }
})
