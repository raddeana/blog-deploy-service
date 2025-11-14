/**
 * 目录变更
 * @author Philip
 */
import shell from 'shelljs';
import _path from '../configs/path.js';

/**
 * 跳转至项目目录
 * @param {array} 参数数组
 * @return none
 */
export const to = async (args) => {
    shell.cd(`/root/${args[0]}`);
    return true
}

/**
 * 回到部署服务目录
 * @return none
 */
export const back = async () => {
    shell.cd(`${_path.deploydir_path}`);
    return true
}
