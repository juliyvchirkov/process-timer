'use strict'

const path = require('path')
const fs = require('fs')

const jsPreprocess = (code, mode = 'lint') => {
    const codeTypeof = typeof code
    const codeTypeofString = codeTypeof === 'string'

    if (!(codeTypeofString || code)) {
        throw new TypeError(
            'String of js code has been expected, got ' +
                (codeTypeofString ? 'empty one' : codeTypeof)
        )
    }

    const modeTypeof = typeof mode
    const modeId = ['lint', 'tune'].indexOf(mode)

    if (modeId === -1) {
        throw new TypeError(
            'String of “lint” or “tune” has been expected, got ' +
                (modeTypeof === 'string' ? 'invalid one' : modeTypeof)
        )
    }

    const prettier = 'prettier'
    const eslint = 'eslint'
    const dotjson = '.json'

    const format = require(prettier).format
    const lint = (() => {
        const lint = new (require(eslint)).CLIEngine({
            configFile : path.join(__dirname, `${ eslint }${ dotjson }`),
            fix : Boolean(modeId),
            useEslintrc : false
        })

        return lint.executeOnText.bind(lint)
    })()

    const formatted = modeId
        ? format(code, require(path.join(__dirname, `${ prettier }${ dotjson }`)))
        : code

    const { linted, lintStats } = (() => {
        const lintStats = lint(formatted).results[0]

        for (const id of ['filePath', 'source']) {
            delete lintStats[id]
        }

        const linted = modeId && lintStats.output ? lintStats.output : null

        return { linted, lintStats }
    })()

    if (modeId) {
        return linted || formatted
    } else {
        console.log()
        console.dir(lintStats, {
            colors : true,
            depth : null
        })
        console.log()
    }
}

const logTpl = 'Code has been %s'

const source = require(path.join(__dirname, '..', 'package.json')).main

let code = fs.readFileSync(source, {
    encoding : 'utf8'
})

const mode = (() => {
    const n = 2
    const noArgs = process.argv.length === n
    const lint = noArgs ? true : ['-l', '--lint'].includes(process.argv[n])
    const tune = noArgs ? true : ['-t', '--tune'].includes(process.argv[n])

    return { lint, tune }
})()

if (mode.tune) {
    const tuned = jsPreprocess(code, 'tune')

    if (code !== tuned) {
        code = tuned

        fs.writeFileSync(source, code, {
            mode : '0644'
        })

        console.log(logTpl, 'tuned')
    }
}

if (mode.lint) {
    jsPreprocess(code, 'lint')

    console.log(logTpl, 'linted')
}
