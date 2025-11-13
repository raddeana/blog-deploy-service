/**
 * 执行脚本
 * @author Philip
 */
import shell from 'shelljs';

export default {
    exec: (_shell) => {
        return new Promise(function (resolve) {
            try {
                shell.exec(_shell, {
                    silent: true
                }, (code, stdout, stderr) => {
                    resolve(code)

                    if (stdout) {
                        console.error('program output:', stdout)
                    }

                    if (code !== 0) {
                        console.error('program stderr:', stderr)
                    }
                })
            } catch (e) {
                resolve('shell error')
            }
        })
    },
    echo: shell.echo,
    exit: shell.exit
}