/**
 * Created by Tea on 2017/2/28.
 */
"use strict";

const fs = require('fs');
const {shell, clipboard} = require('electron');
const AppConfig = require('../js/config.js');
const utils = require('../js/utils.js');

const $dragArea = $('.drag-area');
const $filesTable = $('table.files');

const KEEP_FILE_NAME = 0;
const HASH_FILE_NAME = 2;

$dragArea.on('dragenter dragover dragstart drag dragend', (event) => {
    event.preventDefault();
    $dragArea.addClass('active');
});

$dragArea.on('dragleave', (event) => {
    event.preventDefault();
    $dragArea.removeClass('active');
});

$dragArea.on('drop', (event) => {
    event.preventDefault();
    $dragArea.removeClass('active');

    // 采用jquery时，则使用 event.originalEvent.dataTransfer
    const files = Array.prototype.slice.call(event.originalEvent.dataTransfer.files);

    uploadFiles(files);
});

function uploadFiles(files) {
    files
        .filter((file) => {
            if (file && file.type && utils.getLegalFileTypeByMime(file)) {
                return true;
            } else {
                // 判断是否为目录，如果是目录则上传目录
                uploadDir(file);
                return false;
            }
        })
        .map((file) => {
            upload(file);
        });
}

function uploadDir(file) {
    fs.stat(file.path, (err, stats) => {
        if (err) {
            return;
        }

       // 判断该文件是否是一个目录
        if (stats.isDirectory()) {
            fs.readdir(file.path, (err, filenames) => {
                filenames.map((filename) => {
                    fs.readFile(file.path + '\\' + filename, function (err, curFile) {
                        if (err) {
                            return;
                        }
                        
                        upload(curFile);
                    });
                });
            });
        }
    });
}

function upload(file) {
    let $tr = $(`<tr class="loading">
                    <td class="file-status"><em></em></td>
                    <td class="file-name">${file.name}</td>
                    <td class="file-size">${utils.getFileSizeInHumanReadable(file.size)}</td>
                    <td class="file-link"></td>
                    <td class="file-operator">
                        <button class="btn btn-mini btn-default btn-copy" disabled>复制</button>
                        <button class="btn btn-mini btn-default btn-open" disabled>打开</button>
                    </td>
                  </tr>`);

    $tr.find('.btn-copy').on('click', () => {
        if (!$(this).attr('disabled')) {
            clipboard.writeText($tr.find('.file-link').text());
        }
    });

    $tr.find('.btn-open').on('click', () => {
        if (!$(this).attr('disabled')) {
            shell.openExternal($tr.find('.file-link').text());
        }
    });

    $filesTable.find('tbody').append($tr);
    
    let formData = new FormData();
    formData.append("file", file);
    formData.append("nameType", $('.js-keepName input').attr('checked') ? KEEP_FILE_NAME : HASH_FILE_NAME);

    let url = file.isImage ? AppConfig.imgURL : AppConfig.staticURL;

    $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        dataType: 'JSON',
        cache: false,
        contentType: false,
        processData: false,
        success: function (json) {
            if (json.status == 0) {
                $tr.find('.file-link').html(json.dataJson.url);
                $tr.find('.btn-copy').attr('disabled', false);
                $tr.find('.btn-open').attr('disabled', false);
                $tr.removeClass('loading').addClass('success');
            } else {
                $tr.removeClass('loading').addClass('fail');
            }
        },
        error: function () {
            $tr.removeClass('loading').addClass('fail');
        }
    });
}

// 保留文件名
$('.js-keepName input').on('click', function () {
    let $input = $(this);
    $input.attr('checked', !$input.attr('checked')) 
});

// 防止拖拽图片至其他位置，导致页面跳转
$('body').on('dragenter dragover dragstart drag dragleave dragend drop', (event) => {
    event.preventDefault();
});