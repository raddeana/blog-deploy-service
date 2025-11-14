/**
 * ali oss
 * @author Philip
 */

import AliOss from 'ali-oss';
import { read, } from '../utils/index.js';

/**
 * 获取阿里云 Oss 实例
 * @return {AliOss} 阿里云 Oss SDK 实例
 */
export async function getClient () {
    let deployJson = await this.getConfig()
    let client = null

    if (deployJson) {
        client = new AliOss(deployJson.ali_oss)
    }
    
    return client
}

/**
 * 获取部署配置
 * @return {object} 部署配置
 */
export async function getConfig () {
    try {
        let deploy = await read('.deploy.json', 'utf8')
        let deployJson = JSON.parse(deploy)

        return deployJson
    } catch (err) {
        return false
    }
}

/**
 * 删除
 * @param {string} 要删除的文件路径
 * @return none
 */
export async function remove (objectName) {
    let client = await this.getClient()
    
    try {
        console.info(`removing ${objectName}`)
        return await client.delete(objectName)
    } catch (err) {
        console.error(err)
    }
}

/**
 * 上传
 * @param {string} 要上传的文件路径
 * @return none
 */
export async function upload (objectName, filepath) {
    let client = await this.getClient()
    
    try {
        console.info(`uploading ${objectName}`, filepath)
        let res = await client.put(objectName, filepath)

        return res
    } catch (err) {
        console.error(err)
    }
}
