/**
 * git hook 请求记录
 * @author Philip
 */

import mongoose from 'mongoose';

export default class ReleaseRecord {
    async set (data, results) {
        this.data = Object.assign(data, {
            results,
        })

        let projectDao = mongoose.model('project');
        let { name } = data
        let project = await projectDao.findOneByName(name)

        if (project) {
            this.data.projectId = mongoose.Types.ObjectId(project._id)
        }
    }
    
    /**
     * 获取可存储的日志数据
     * @return {object} 日志数据 
     */
    get () {
        return this.data
    }
}
