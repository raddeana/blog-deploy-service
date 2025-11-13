/**
 * 用户
 * @author Philip
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// user
const schema = new Schema({
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        trim: true
    }
})
 
// 校验
schema.path('username').required(true, 'username cannot be blank')
schema.path('password').required(true, 'password cannot be blank')

schema.statics = {
    /**
     * 登录
     * @param {string} 用户名
     * @param {string} 密码
     * @return {object} 用户
     */
    async login (username, password) {
        let user = null
    
        try {
            user = await this.findOne({ username }).exec()
        } catch (e) {
            return {
                code: 500,
                message: '未知错误，请重试'
            }
        }
        
        if (user && user.password === password) {
            return {
                code: 200,
                user
            }
        } else {
            if (!user) {
                return {
                    code: 403,
                    message: '用户名错误'           
                }
            } else {
                return {
                    code: 403,
                    message: '密码错误'
                }
            }
        }
    },

    /**
     * 登录
     * @param {string} 用户名
     * @param {string} 密码
     * @return {object} 用户
     */
    async modifyPassword (_user) {
        let user = null
    
        try {
            await user.findByIdAndUpdate(user._id, _user)
        } catch (e) {
            return {
                code: 404,
                message: '用户未找到'
            }
        }
        
        return {
            code: 200,
            data: {
                _id: user._id
            }
        }
    }
}

module.exports = mongoose.model('user', schema)
