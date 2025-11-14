/**
 * 部署相关行为代理
 * @author Philip
 */
 
// 行为错误信息
import errorMessages from '../constants/deploy-errors.js';

// 部署服务
import { build, } from'./npm.js';
import { push, pull, } from './git.js';
import { to, back, } from './catalog.js';
import { start, restart, replaceVersion, } from './project.js';

class Proxy {
    /**
     * 构造函数
     * @contructor
     */
    constructor () {
        this.nonBlocking = true
    }
  
    /**
     * 获取行为处理函数
     * @param {string} 行为
     * @param {array} 参数
     * @return {boolean} 行为结果，成功或者失败
     */
    async actionHandler (action, args) {
        let success = false

        console.info(`processing ${action}`)

        switch (action) {
            case 'npm.build':
                success = await build(args)
                break
            case 'catalog.to':
                success = await to(args)
                break
            case 'catalog.back':
                success = await back(args)
                break
            case 'project.start':
                success = await start(args)
                break
            case 'project.restart':
                success = await restart(args)
                break
            case 'project.replaceVersion':
                success = await replaceVersion(args)
                break
            case 'git.push':
                success = await push(args)
                break
            case 'git.pull':
                success = await pull(args)
                break
        }

        return success
    }
  
    /**
     * 获取行为错误信息
     * @param {string} 行为
     * @return {string} 行为错误信息
     */
    getActionErrorMsg (action) {
        let {
            BUILDERROR,
            TOPROJECTERROR,
            BACKDEPLOYERROR,
            STARTERROR,
            RESTARTERROR,
            REPLACEVERSIONERROR,
            PUSHERROR,
            PULLERROR
        } = errorMessages

        switch (action) {
        case 'build':
            return BUILDERROR
        case 'catalog.to':
            return TOPROJECTERROR
        case 'catalog.back':
            return BACKDEPLOYERROR
        case 'project.start':
            return STARTERROR
        case 'project.restart':
            return RESTARTERROR
        case 'project.replaceVersion':
            return REPLACEVERSIONERROR
        case 'git.push':
            return PUSHERROR
        case 'git.pull':
            return PULLERROR
        }
    }

  /**
   * 调用部署行为
   * @param {string} 行为
   * @param {array} 调用数组
   * @return {object} 调用结果
   */
    async call (action, args) {
        if (!this.nonBlocking) {
            return {
                success: false,
                message: 'no execution caused by error blocking'
            }
        }

        const success = await this.actionHandler.bind(this)(action, args)

        if (success) {
            return {
                success: true,
                message: 'execute success'
            }
        } else {
            this.nonBlocking = false

            return {
                success: false,
                message: this.getActionErrorMsg(action)
            }
        }
    }
}

export default Proxy
