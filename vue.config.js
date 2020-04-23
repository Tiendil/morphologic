module.exports = {
    "lintOnSave": false,

    "runtimeCompiler": true, // TODO: on release: https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only ?

    "transpileDependencies": [
        "vuetify"
    ],

    "publicPath": process.env.NODE_ENV === 'production' ? '/morphologic/' : '/'
}
