const propsenv = require('propsenv')

module.exports = ({types: t}) => ({
    name: 'propsenv-import',

    visitor: {
        ImportDeclaration(path, {opts}) {
            if (path.node.source.value === opts.moduleName) {

                this.opts = {
                    moduleName: '@env',
                    path: './env/',
                    whitelist: null,
                    blacklist: null,
                    // safe: false,
                    allowUndefined: true,
                    debug: false,
                    profile: null,
                    ...this.opts
                }

                const babelMode = process.env.RN_PROPS_ENV || this.opts.profile ||  process.env.NODE_ENV || 'local'

                propsenv({
                    profile: babelMode,
                    path: this.opts.path,
                    debug: this.opts.debug
                })

                this.env = process.env

                path.node.specifiers.forEach((specifier, idx) => {
                    if (specifier.type === 'ImportDefaultSpecifier') {
                        throw path.get('specifiers')[idx].buildCodeFrameError('Default import is not supported')
                    }

                    if (specifier.type === 'ImportNamespaceSpecifier') {
                        throw path.get('specifiers')[idx].buildCodeFrameError('Wildcard import is not supported')
                    }

                    if (specifier.imported && specifier.local) {

                        const importedId = specifier.imported.name
                        const localId = specifier.local.name

                        if (Array.isArray(opts.whitelist) && !opts.whitelist.includes(importedId)) {
                            throw path.get('specifiers')[idx].buildCodeFrameError(`"${importedId}" was not whitelisted`)
                        }

                        if (Array.isArray(opts.blacklist) && opts.blacklist.includes(importedId)) {
                            throw path.get('specifiers')[idx].buildCodeFrameError(`"${importedId}" was blacklisted`)
                        }

                        if (!opts.allowUndefined && !Object.prototype.hasOwnProperty.call(this.env, importedId)) {
                            throw path.get('specifiers')[idx].buildCodeFrameError(`"${importedId}" is not defined in ${opts.path}`)
                        }

                        const binding = path.scope.getBinding(localId)

                        binding.referencePaths.forEach(refPath => {
                            refPath.replaceWith(t.valueToNode(this.env[importedId]))
                        })
                    }
                })
                path.remove()
            }
        }
    }
})
