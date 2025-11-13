/**
 * release 记录列表
 * @author Philip
 */
const mongoose = require('mongoose')
const projectSchema = require('./project')
const Schema = mongoose.Schema

// 发布记录
const schema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    url: {
        type: String,
        default: '',
        trim: true
    },
    tag_name: {
        type: String,
        default: '',
        trim: true
    },
    repository: {
        type: String,
        default: '',
        trim: true
    },
    published_at: {
        type: Date,
        default: Date.now
    },
    results: {
        type: Object,
        default: {}
    },
    projectId: {
        type: Schema.Types.ObjectId, 
        ref: 'project' 
    }
})
 
// 校验
schema.path('url').required(true, 'url cannot be blank')
schema.path('repository').required(true, 'repository cannot be blank')
schema.path('tag_name').required(true, 'tag name cannot be blank')
schema.path('published_at').required(true, 'published time cannot be blank')

schema.statics = {
   /**
    * 获取release 记录列表
    * @param {object} 过滤条件
    * @param {number} 页码
    * @param {number} 大小
    * @return {object} 查询结果
    */
    async query (filters, pageIndex, pageSize) {
        let query = this.find(filters)
        let total = await query.count()
        let list = await query.skip(pageSize * (pageIndex - 1)).limit(pageSize * pageIndex)
            .sort({ createdAt: -1 })
            .exec('find')

        return {
            code: 200,
            data: {
                list,
                total
            }
        }
    },
    
    /**
     * 添加日志
     * @param {ReleaseRecordDto} release 记录
     * @return {array} list
     */
    async create (releaseRecord) {
        let ReleaseRecordModel = this.model('releaseRecord')
        let releaseRecordModel = new ReleaseRecordModel(releaseRecord)
        let result = await releaseRecordModel.save()
        
        return result
    },
    
    /**
     * 删除日志
     * @param {string} 记录id
     * @return {array} list
     */
    async delete (id) {
        let result = await this.remove({ _id: id })

        return result
    }
}

let releaseRecordDao = mongoose.model('releaseRecord', schema)
mongoose.model('project', projectSchema)

module.exports = releaseRecordDao
