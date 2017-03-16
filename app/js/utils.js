const filesMime = {
    'application/javascript': 'js',
    'application/x-javascript': 'js',
    'text/css': 'css',

    // 文本
    //'text/html': 'html',
    //'text/xml': 'xml',
    //'text/plain': 'txt',

    // 图片
    'image/gif': 'gif',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/bmp': 'bmp',
    'image/x-icon': 'ico',
    'image/svg+xml': 'svg',

    // 字体
    'application/font-woff': 'woff',
    'application/vnd.ms-fontobject': 'eot',
    'application/octet-stream': 'otf',
    'application/octet-stream': 'ttf',
    
    // 其他静态资源
    'application/x-shockwave-flash': 'swf'
};

const filesSuffix = {
    // 字体
    'ttf': 'ttf',
    'eot': 'eot'
};

module.exports = {
    getLegalFileTypeByMime(file) {
        let fileType = file.type,
            fileName = file.name;

        if (fileType && filesMime.hasOwnProperty(fileType)) {
            // 根据文件类型判断
            file.isImage = fileType.indexOf('image') > -1;
            return file.simpleType = filesMime[fileType];
        } else if (fileName && filesSuffix.hasOwnProperty(fileName.substr(fileName.indexOf('.') + 1))) {
            // 根据文件后缀判断
            return filesSuffix[file.name.substr(file.name.indexOf('.') + 1)];
        } else {
            return '';
        }
    },

    getFileSizeInHumanReadable(fileSize) {
        let size = fileSize || 0,
            units = ['B', 'K', 'MB', 'GB'],
            result;

        for (var i = 0, len = units.length; i < len; i++) {
            if (size >= 1024 && i !== units.length - 1) {
                size = size / 1024;
            } else if (size < 1024 || i === units.length - 1) {
                result = size.toFixed(2) + units[i];
                break;
            }
        }

        return result;
    }
};