# 前端 UI

## 如何进行本地调试 @bb-music/app

.umirc.ts  
添加别名路径为 @bb-music/app 绝对路径

```ts
alias: {
    '@bb-music/app': '/Users/lyy/code/project/bb-music/core/app',
}
```

tsconfig.json  
添加 path 为 @bb-music/app 绝对路径

```json
"paths": {
  "@bb-music/app": ["/Users/lyy/code/project/bb-music/core/app"],
}
```
