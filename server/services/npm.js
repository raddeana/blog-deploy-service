/**
 * 部署构建
 * @author Philip
 */
import { exec, echo, exit } from './shell.js';

/**
 *   构建
 * @return none
 */
export const build = async (args) => {
    let code = await exec('npm run build')
    
    if (code !== 0) {
        echo(`Error:\tbuild\t${args[0]}\tfailed`)
        exit(1)

        return false
    }

    return true
}
