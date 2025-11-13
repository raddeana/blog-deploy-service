/**
 * git hook 发出的请求
 * @author Philip
 */
import fs from 'fs'
import path from 'path'

// 配置
import _path from '../config/path'

// 服务
import Proxy from '../service/proxy'
import aliOss from '../service/ali-oss'

// dao
import releaseRecordDao from '../dao/release-record'

// dto
import ReleaseRecordDto from '../dto/release-record'
import HookData from '../dto/hook-data'

/**
 * 遍历文件夹
 * @param {string} 文件夹路径
 * @param {function} 处理函数
 * @return none
 */
let ergodicFolder = async (folderPath, handler) => {
    let files = fs.readdirSync(folderPath)
    
    for (let i = 0, len = files.length; i < len; i++) {
        let fof = files[i]
        let stat = fs.lstatSync(folderPath + '/' + fof)

        if (stat.isDirectory() === true) { 
            await ergodicFolder(folderPath + '/' + fof, handler)
        } else {
            await handler(fof, folderPath + '/' + fof)
        }
    }
}

/**
 * git release
 * @Controller
 */
export const release = async (req, res) => {
    let proxy = new Proxy()
    let data = new HookData(req.body)
    let { repository, tag_name, action } = data.get()
    
    if (action === 'published') {
        let { web_dir, server_dir } = _path
        let isWeb = /\.web/.test(repository)

        repository = repository.replace('blog.', '').replace('.web', '')

        let catalog = isWeb ? web_dir : server_dir
        let results = {}

        results.catalogTo = await proxy.call('catalog.to', [`${repository}${path.sep}${catalog}`])
        results.gitPull = await proxy.call('git.pull', [])

        // 构建可发布版本
        if (isWeb) {
            results.npmBuild = await proxy.call('npm.build', [`${repository}`])
            results.projectReplaceHash = await proxy.call('project.replaceVersion', [`${tag_name}`])
            results.gitPush = await proxy.call('git.push', [`${repository}`])
        }

        if (isWeb && proxy.nonBlocking) {
            let manifestTest = /manifest\.json/
            let wwwTest = /\.html/
            let jsTest = /\/js/
            let cssTest = /\/css/

            ergodicFolder('dist', (file, filePath) => {
                if (!manifestTest.test(filePath) && !wwwTest.test(filePath)) {
                    if (jsTest.test(filePath)) {
                        file = `/js/${file}`
                    }

                    if (cssTest.test(filePath)) {
                        file = `/css/${file}`
                    }

                    aliOss.upload(file, filePath)
                }
            })
        }

        results.projectRestart = await proxy.call('project.restart', [`${repository}`])

        if (!results.projectStart.success) {
            results.projectStart = await proxy.call('project.start', [`${repository}`])
        }

        results.catalogBack = await proxy.call('catalog.back', [])

        let releaseRecordDto = new ReleaseRecordDto()

        await releaseRecordDto.set(data.get(), results)
        await releaseRecordDao.create(releaseRecordDto.get())
    }
    
    res.send({
        message: 'hello github'
    })
}

/**
 * 部署发布
 * @param {object} 请求
 * @param {object} 相应
 * @Controller
 */
export const deployRelease = async (req, res) => {
    let proxy = new Proxy()
    let data = new HookData(req.body)
    let { repository, tag_name, action } = data.get()
    
    if (action === 'published') {
        let results = {}

        results.projectReplaceHash = await proxy.call('project.replaceVersion', [`${tag_name}`])
        results.gitPush = await proxy.call('git.push', [`${repository}`])

        results.projectRestart = await proxy.call('project.restart', [`${data.project}`])

        if (!results.projectStart.success) {
            results.projectStart = await proxy.call('project.start', [`${data.project}`])
        }

        let releaseRecordDto = new ReleaseRecordDto()

        await releaseRecordDto.set(data.get(), results)
        await releaseRecordDao.create(releaseRecordDto.get())
    }
    
    res.send({
        message: 'hello github'
    })
}
