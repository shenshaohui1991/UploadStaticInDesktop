/**
 * Created by Tea on 2017/2/28.
 */
"use strict";

const {shell, clipboard} = require('electron');
const AppConfig = require('../js/config.js');
const utils = require('../js/utils.js');

const $dragArea = $('.drag-area');
const $filesTable = $('table.files');
const $uploadBtn = $('.upload-file-btn input[type="file"]');

const KEEP_FILE_NAME = 1;
const HASH_FILE_NAME = 2;

const URL_HTTPS = 1;
const URL_HTTP = 0;

const FILE_COMPRESS = 1;
const FILE_UNCOMPRESS = 2;

(function () {
    preventDrag();
    addUploadEvent();
})();

function addUploadEvent() {
    $dragArea.on('drop', (event) => {
        event.preventDefault();
        $dragArea.removeClass('active');

        // 采用jquery时，则使用 event.originalEvent.dataTransfer
        uploadFiles(Array.from(event.originalEvent.dataTransfer.files));
    });

    $uploadBtn.change((event) => {
        uploadFiles(Array.from(event.currentTarget.files));
    });

    // 功能菜单
    $('.js-keepName input, .js-uglify input, .js-https input').on('click', function () {
        $(this).attr('checked', !$(this).attr('checked'))
    });

    // 清空列表
    $('.clear-list-btn').on('click', function () {
        $filesTable.find('tbody').empty();
    });
}

function preventDrag() {
    $dragArea.on('dragenter dragover dragstart drag dragend', (event) => {
        event.preventDefault();
        $dragArea.addClass('active');
    });

    $dragArea.on('dragleave', (event) => {
        event.preventDefault();
        $dragArea.removeClass('active');
    });

    // 防止拖拽图片至其他位置，导致页面跳转
    $('body').on('dragenter dragover dragstart drag dragleave dragend drop', (event) => {
        event.preventDefault();
    });
}

function uploadFiles(files) {
    files
        .filter((file) => {
            if (file && utils.getLegalFileType(file)) {
                return true;
            } else if (file && file.size > 0) {
                let $tr = createTrElement(file);
                
                $tr.find('.file-link').html('文件类型不支持');
                $tr.removeClass('loading').addClass('fail');
                $filesTable.find('tbody').prepend($tr);
                
                return false;
            } else {
                return false;
            }
        })
        .map((file) => {
            upload(file);
        });
}

function createTrElement(file) {
    return $(`<tr class="loading">
                <td class="file-status"><em></em></td>
                <td class="file-name">${file.name}</td>
                <td class="file-size">${utils.getFileSize(file.size)}</td>
                <td class="file-link"></td>
                <td class="file-operator">
                    <button class="btn btn-mini btn-default btn-copy" disabled>复制</button>
                    <button class="btn btn-mini btn-default btn-open" disabled>打开</button>
                </td>
              </tr>`);
}

function upload(file) {
    let $tr = createTrElement(file);

    $tr.find('.btn-copy').on('click', function () {
        if (!$(this).attr('disabled')) {
            clipboard.writeText($tr.find('.file-link').text());
        }
    });

    $tr.find('.btn-open').on('click', function () {
        if (!$(this).attr('disabled')) {
            shell.openExternal($tr.find('.file-link').text());
        }
    });

    $filesTable.find('tbody').prepend($tr);
    
    let formData = new FormData();
    formData.append("file", file);

    let url, querys = [],
        needHttps = $('.js-https input').attr('checked') ? URL_HTTPS : URL_HTTP;
    
    querys.push('nameType=' + ($('.js-keepName input').attr('checked') ? HASH_FILE_NAME : KEEP_FILE_NAME));
    querys.push('compress=' + ($('.js-uglify input').attr('checked') ? FILE_UNCOMPRESS : FILE_COMPRESS));
    querys.push('https=' + needHttps);
    
    url = (file.isImage ? AppConfig.imgURL : AppConfig.staticURL) + '?' + querys.join('&');
    
    $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        dataType: 'JSON',
        cache: false,
        contentType: false,
        processData: false,
        timeout: 30000,
        success: function (json) {
            if (json.status == 0 && json.dataJson) {
                $tr.find('.file-link').html(needHttps == URL_HTTPS ? json.dataJson.url: json.dataJson.url.replace('https:', 'http:'));
                $tr.find('.btn-copy').attr('disabled', false);
                $tr.find('.btn-open').attr('disabled', false);
                $tr.removeClass('loading').addClass('success');
            } else {
                let errorMsg = json.dataJson.msg || '未知错误';

                $tr.find('.file-link').html(errorMsg);
                $tr.removeClass('loading').addClass('fail');
            }
        },
        error: function () {
            $tr.find('.file-link').html('网络错误');
            $tr.removeClass('loading').addClass('fail');
        }
    });
}