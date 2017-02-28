/**
 * Created by Tea on 2017/2/28.
 */
"use strict";

const AppConfig = require('./config.js');

function doUpload() {
    var formData = new FormData($( "#uploadForm" )[0]);
    $.ajax({
        url: AppConfig.uploadUrl,
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (returndata) {
            console.dir(returndata);
        },
        error: function (returndata) {
            console.dir(returndata);
        }
    });
}

