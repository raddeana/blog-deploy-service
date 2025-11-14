/**
 * 项目
 * @author Philip
 */
import projectDao from '../models/dao/project.js';

/**
 * 项目查询
 * @Controller
 */
export const query = async (req, res) => {
    let params = req.query || {}
    let filters = {}

    let { pageIndex, pageSize } = params

    Object.keys(params).forEach((key) => {
        const val = params[key]

        if (key !== 'pageIndex' || key !== 'pageSize') {
            filters[key] = val
        }
    })
  
    let { code, message, data } = await projectDao.query(filters, pageIndex, pageSize)
  
    if (code === 200) {
        res.json(data)
    } else {
        res.send(code, { message })
    }
}

/**
 * 创建新项目
 * @Controller
 */
export const create = async (req, res) => {
    let result = await projectDao.create(req.body)
    
    if (result.success) {
        res.json(result.data)
    } else {
        res.send(result.code, { 
            message: result.message 
        })
    }
}

/**
 * 新项目更新
 * @Controller
 */
module.exports.update = async (req, res) => {
    let result = await projectDao.update(req.body)
  
    if (result.success) {
        res.json(result.data)
    } else {
        res.send(result.code, { message: result.message })
    }
}
