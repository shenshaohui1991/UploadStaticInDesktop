# UploadStaticInDesktop

这是一个利用Electron编写的上传静态资源的桌面应用，主要目的是为了学习怎么使用Electron。因为**上传地址**的原因本项目仅适合个人使用或作为学习electron的例子。

## 安装过程

推荐使用`cnpm`安装`electron`（解决很多国外镜像下载不动的问题），`cnpm`谁用谁知道

1. `npm install cnpm -g --registry=http://registry.npm.taobao.org`
2. `cnpm install electron -g`
3. `cnpm i`

## 打包过程(windows)

1. `gulp build`
2. `npm run build-win`
3. 利用`nsis`中`zip2exe`的打包