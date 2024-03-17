module.exports = {
    "env": {
        "browser": true,  // 如果你的代码也要在浏览器环境中运行，保留这一行
        "node": true,  // 添加这一行来指示代码运行在 Node.js 环境中
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "rules": {
    }
}
