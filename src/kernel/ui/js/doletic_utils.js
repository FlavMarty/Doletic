// ----------------------------------- Doletic UI elements factory -----------------------------------


var DoleticUIFactory = new function () {

    this.makeUploadForm = function (id, hidden) {
        var html = "<form id=\"upload_form_" + id + "\" class=\"ui form segment\"";
        if (hidden == true) {
            html += " hidden=\"\"";
        }
        html += "> \
              <input id=\"file_input_" + id + "\" name=\"file_" + id + "\" type=\"file\" hidden=\"\" onChange=\" \
              if($('#file_input_" + id + "')[0].files.length > 0) { \
                $('#selected_filename_" + id + "').html($('#file_input_" + id + "').val()); \
                $('#upload_btn_" + id + "').html('Envoyer !'); \
                $('#upload_btn_" + id + "').attr('class', 'ui green circular button'); \
                $('#upload_btn_" + id + "').attr('onclick', ''); \
                $('#upload_btn_" + id + "').click(function(){ \
                  var formData = new FormData(); \
                  formData.append('q', 'service'); \
                  formData.append('obj', 'service'); \
                  formData.append('act', 'upload'); \
                  if($('#file_input_" + id + "')[0].files[0] != undefined) { \
                    formData.append('file', $('#file_input_" + id + "')[0].files[0], $('#file_input_" + id + "').val()); \
                    DoleticServicesInterface.upload(formData, function(data){ \
                      if(data.code != 0) { \
                        DoleticMasterInterface.showError('Erreur upload !',data.error); \
                      } else { \
                        DoleticUIModule.uploadSuccessHandler('" + id + "', data.object); \
                      } \
                    }); \
                  } else { \
                    $('#file_input_" + id + "').click(); \
                  } \
                  $('#upload_btn_" + id + "').attr('click', '$(\\'#file_input_" + id + "\\').click();'); \
                  $('#upload_form_" + id + "')[0].reset(); \
                });";
        if (hidden == true) {
            html += "$('#upload_btn_" + id + "').click();";
        }
        html += "}\"/> \
              <div class=\"inline field\"> \
                <a id=\"upload_btn_" + id + "\" class=\"ui circular button\" onClick=\"$('#file_input_" + id + "').click();\"><i class=\"upload icon\"></i>Sélectionner...</a> \
                <label id=\"selected_filename_" + id + "\">aucun fichier sélectionné...</label> \
              </div> \
            </form>";
        return html;
    };

    this.JSONSyntaxHighlight = function (json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        } else {
            json = JSON.stringify(JSON.parse(json), undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'json_number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json_key';
                } else {
                    cls = 'json_value';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json_bool';
            } else if (/null/.test(match)) {
                cls = 'json_null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    };

    this.padleft = function (string, size, c) {
        return Array(Math.max(size - string.length + 1, 0)).join(c) + string;
    };

    this.padright = function (string, size, c) {
        return string + Array(Math.max(size - string.length + 1, 0)).join(c);
    }

};

// ----------------------------------- Doletic Settings Manager -----------------------------------

var DoleticUISettingsManager = new function () {

    // settings structure
    this.settings = {
        night_mode: false
    };
    // expire variable
    this.expire = 1;
    // external cookie
    this.external_cookie = "";
    /**
     *  Initializes UI settings
     */
    this.init = function () {
        if (document.cookie.length > 0) {
            var c = document.cookie;
            while (c.length > 0 && c.indexOf("settings=") != 0) {
                this.external_cookie += c.charAt(0);
                c = c.substr(1);
            }
        }
        if (c.length > 0) {
            this.restoreSettings(c);
        } else {
            this.persistSettings();
        }
    };
    /**
     *  Saves settings into a cookie
     */
    this.persistSettings = function () {
        // compute expire timestamp
        var d = new Date();
        d.setTime(d.getTime() + (this.expire * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        // write cookie
        var c = this.external_cookie + "; settings=" + JSON.stringify(this.settings) + "; " + expires;
        alert(c);
        document.cookie = c;
        alert(document.cookie);
    };
    /**
     *  Retrieves settings from a cookie
     */
    this.restoreSettings = function (c) {
        // read and parse cookie
        var settings = c.split(';')[0].split('=')[1];
        // restore settings using JSON parse method
        this.settings = JSON.parse(settings);
    }

};

// ----------------------------------- SOME PHP JS FUNCTIONS -----------------------------------

var phpjsLight = new function () {

    this.utf8_encode = function (argString) {
        //  discuss at: http://phpjs.org/functions/utf8_encode/
        // original by: Webtoolkit.info (http://www.webtoolkit.info/)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: sowberry
        // improved by: Jack
        // improved by: Yves Sucaet
        // improved by: kirilloid
        // bugfixed by: Onno Marsman
        // bugfixed by: Onno Marsman
        // bugfixed by: Ulrich
        // bugfixed by: Rafal Kukawski
        // bugfixed by: kirilloid
        //   example 1: utf8_encode('Kevin van Zonneveld');
        //   returns 1: 'Kevin van Zonneveld'

        if (argString === null || typeof argString === 'undefined') {
            return '';
        }

        var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        var utftext = '',
            start, end, stringl = 0;

        start = end = 0;
        stringl = string.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n);
            var enc = null;

            if (c1 < 128) {
                end++;
            } else if (c1 > 127 && c1 < 2048) {
                enc = String.fromCharCode(
                    (c1 >> 6) | 192, (c1 & 63) | 128
                );
            } else if ((c1 & 0xF800) != 0xD800) {
                enc = String.fromCharCode(
                    (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                );
            } else { // surrogate pairs
                if ((c1 & 0xFC00) != 0xD800) {
                    throw new RangeError('Unmatched trail surrogate at ' + n);
                }
                var c2 = string.charCodeAt(++n);
                if ((c2 & 0xFC00) != 0xDC00) {
                    throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
                }
                c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
                enc = String.fromCharCode(
                    (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                );
            }
            if (enc !== null) {
                if (end > start) {
                    utftext += string.slice(start, end);
                }
                utftext += enc;
                start = end = n + 1;
            }
        }

        if (end > start) {
            utftext += string.slice(start, stringl);
        }

        return utftext;
    };


    this.sha1 = function (str) {
        //  discuss at: http://phpjs.org/functions/sha1/
        // original by: Webtoolkit.info (http://www.webtoolkit.info/)
        // improved by: Michael White (http://getsprink.com)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        //    input by: Brett Zamir (http://brett-zamir.me)
        //  depends on: utf8_encode
        //   example 1: sha1('Kevin van Zonneveld');
        //   returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

        var rotate_left = function (n, s) {
            var t4 = (n << s) | (n >>> (32 - s));
            return t4;
        };

        /*var lsb_hex = function (val) { // Not in use; needed?
         var str="";
         var i;
         var vh;
         var vl;

         for ( i=0; i<=6; i+=2 ) {
         vh = (val>>>(i*4+4))&0x0f;
         vl = (val>>>(i*4))&0x0f;
         str += vh.toString(16) + vl.toString(16);
         }
         return str;
         };*/

        var cvt_hex = function (val) {
            var str = '';
            var i;
            var v;

            for (i = 7; i >= 0; i--) {
                v = (val >>> (i * 4)) & 0x0f;
                str += v.toString(16);
            }
            return str;
        };

        var blockstart;
        var i, j;
        var W = new Array(80);
        var H0 = 0x67452301;
        var H1 = 0xEFCDAB89;
        var H2 = 0x98BADCFE;
        var H3 = 0x10325476;
        var H4 = 0xC3D2E1F0;
        var A, B, C, D, E;
        var temp;

        str = this.utf8_encode(str);
        var str_len = str.length;

        var word_array = [];
        for (i = 0; i < str_len - 3; i += 4) {
            j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
            word_array.push(j);
        }

        switch (str_len % 4) {
            case 0:
                i = 0x080000000;
                break;
            case 1:
                i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
                break;
            case 2:
                i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
                break;
            case 3:
                i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
                    8 | 0x80;
                break;
        }

        word_array.push(i);

        while ((word_array.length % 16) != 14) {
            word_array.push(0);
        }

        word_array.push(str_len >>> 29);
        word_array.push((str_len << 3) & 0x0ffffffff);

        for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
            for (i = 0; i < 16; i++) {
                W[i] = word_array[blockstart + i];
            }
            for (i = 16; i <= 79; i++) {
                W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
            }

            A = H0;
            B = H1;
            C = H2;
            D = H3;
            E = H4;

            for (i = 0; i <= 19; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 20; i <= 39; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 40; i <= 59; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 60; i <= 79; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            H0 = (H0 + A) & 0x0ffffffff;
            H1 = (H1 + B) & 0x0ffffffff;
            H2 = (H2 + C) & 0x0ffffffff;
            H3 = (H3 + D) & 0x0ffffffff;
            H4 = (H4 + E) & 0x0ffffffff;
        }

        temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
        return temp.toLowerCase();
    }

};