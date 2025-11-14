/**
 * git钩子记录
 * @author Philip
 */
import releaseRecordDao from '../models/dao/release-record.js'

/**
 * 记录查询
 * @Controller
 */
export const uery = async (req, res) => {
    let params = req.query || {}
    let { pageIndex, pageSize } = params
    let filters = {}
    
    Object.keys(params).forEach((key) => {
        const val = params[key]
        
        if (key !== 'pageIndex' && key !== 'pageSize') {
            filters[key] = val
        }
    })
    
    let { code, message, data } = await releaseRecordDao.query(filters, pageIndex, pageSize)

    if (code === 200) {
        res.json(data)
    } else {
        res.send(code, { message })
    }
}

/**
 * 记录删除
 * @Controller
 */
export const remove = (req, res) => {
    let params = req.params || {}
    let condition = {}
    
    Object.keys(params).forEach((key) => {
        const val = params[key]
        
        if (key !== 'pageIndex' || key !== 'pageSize') {
            condition[key] = val
        }
    })
  
    let result = releaseRecordDao.query(condition, params.pageIndex, params.pageSize)
  
    if (result.success) {
        res.json(result.data)
    } else {
        res.send(result.code, { message: result.message })
    }
}
