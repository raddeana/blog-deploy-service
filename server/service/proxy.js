/**
 * 部署相关行为代理
 * @author Philip
 */
 
// 行为错误信息
import errorMessages from '../constant/deploy-errors.js';

// 部署服务
import npm from'./npm.js';
import git from './git.js';
import catalog from './catalog.js';
import project from './project.js';

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
                success = await npm.build(args)
                break
            case 'catalog.to':
                success = await catalog.to(args)
                break
            case 'catalog.back':
                success = await catalog.back(args)
                break
            case 'project.start':
                success = await project.start(args)
                break
            case 'project.restart':
                success = await project.restart(args)
                break
            case 'project.replaceVersion':
                success = await project.replaceVersion(args)
                break
            case 'git.push':
                success = await git.push(args)
                break
            case 'git.pull':
                success = await git.pull(args)
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
