/**
 * Created by Tea on 2017/2/28.
 */
"use strict";

const AppConfig = require('../js/config.js');
const $dragArea = $('.drag-area');
const $filesTable = $('table.files');
const fileFilters = [
        // 静态文件
        'application/javascript',
        'application/x-javascript',
        'text/html',
        'text/css',
        'text/xml',
        'text/plain',

        // 图片
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/bmp',
        'image/x-icon'
    ];

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

    files
        .filter((file) => {
            return file && file.type && fileFilters.indexOf(file.type) > -1;
        })
        .map((file) => {
            console.log(file);
            upload(file);
        });
});

function upload(file) {
    let $tr = $(`<tr class="loading"><td class="file-status"><em></em></td><td class="file-name">${file.name}</td><td class="file-type">${file.type}</td><td class="file-size">${file.size}</td><td class="file-link"></td><td class="file-operator"><button class="btn btn-mini btn-default"><span class="icon icon-link"></span></button></td></tr>`);
    $filesTable.find('tbody').append($tr);
    
    let formData = new FormData();
    formData.append("file", file);
    
    $.ajax({
        url: AppConfig.imgURL,
        type: 'POST',
        data: formData,
        dataType: 'JSON',
        cache: false,
        contentType: false,
        processData: false,
        success: function (json) {
            if (json.status == 0) {
                $tr.find('.file-link').html(json.dataJson.url);
                $tr.removeClass('loading').addClass('success');
            } else {
                $tr.removeClass('loading').addClass('error');
            }
        },
        error: function () {
            $tr.removeClass('loading').addClass('error');
        }
    });
}

// 防止拖拽图片至其他位置，导致页面跳转
$('body').on('dragenter dragover dragstart drag dragleave dragend drop', (event) => {
    event.preventDefault();
});