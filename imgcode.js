var getter = require("pixel-getter");
var Jimp = require("jimp");
var base64 = require("base-64");
var utf8 = require("utf8");
const express = require("express");
const router = express.Router();

function string2BinaryArray(str1) {
    var bytes = utf8.encode(str1);
    var str = base64.encode(bytes);
    str += "}";
    var result = [];
    for (var i = 0; i < str.length; i++) {
        var bstr = str.charCodeAt(i).toString(2);
        if (bstr.length < 7) {
            for (var j = 0; j < 7 - bstr.length; j++) {
                bstr = "0" + bstr;
            }
        }
        result.push(bstr);
    }
    return result;
}

function bin2char(binary) {
    return String.fromCharCode(parseInt(binary, 2));
}

function decodeBase64ToUTF(encode) {
    var data2 = base64.decode(encode);
    data2 = utf8.decode(data2);
    return data2;
}

function bin2utfString(binaryArray) {
    var b64encoded = "";
    for (var i = 0; i < binaryArray.length; i++) {
        b64encoded += bin2char(binaryArray[i]);
    }
    var data2 = base64.decode(b64encoded);
    data2 = utf8.decode(data2);
    return data2;
}

function encodebitandColorValue(bit, cvalue) {
    cvalue = "" + cvalue;

    var data1 = cvalue.charAt(cvalue.length - 1);
    var data2 = "";
    if (bit == "0") {
        if (data1 == "0") {
            data2 = "0";
        } else if (data1 == "1") {
            data2 = "0";
        } else if (data1 == "2") {
            data2 = "2";
        } else if (data1 == "3") {
            data2 = "2";
        } else if (data1 == "4") {
            data2 = "4";
        } else if (data1 == "5") {
            data2 = "4";
        } else if (data1 == "6") {
            data2 = "6";
        } else if (data1 == "7") {
            data2 = "6";
        } else if (data1 == "8") {
            data2 = "8";
        } else if (data1 == "9") {
            data2 = "8";
        }
    } else if (bit == "1") {
        if (data1 == "0") {
            data2 = "1";
        } else if (data1 == "1") {
            data2 = "1";
        } else if (data1 == "2") {
            data2 = "3";
        } else if (data1 == "3") {
            data2 = "3";
        } else if (data1 == "4") {
            data2 = "5";
        } else if (data1 == "5") {
            data2 = "5";
        } else if (data1 == "6") {
            data2 = "7";
        } else if (data1 == "7") {
            data2 = "7";
        } else if (data1 == "8") {
            data2 = "9";
        } else if (data1 == "9") {
            data2 = "9";
        }
    }
    var str2 = cvalue.substring(0, cvalue.length - 1) + data2;
    return parseInt(str2);
}

function decodebitandColorValue(cvalue) {
    cvalue = "" + cvalue;

    var data1 = cvalue.charAt(cvalue.length - 1);
    var digit = "";

    if (
        data1 == "0" ||
        data1 == "2" ||
        data1 == "4" ||
        data1 == "6" ||
        data1 == "8"
    ) {
        digit = "0";
    } else if (
        data1 == "1" ||
        data1 == "3" ||
        data1 == "5" ||
        data1 == "7" ||
        data1 == "9"
    ) {
        digit = "1";
    }

    return digit;
}
//Register
module.exports.encode = function(data1, imgbuffer, callback) {
    var binarys = string2BinaryArray(data1);

    var num_bytes = binarys.length;
    var num_digit = 7;

    var byte_ind = 0;
    var dit_ind = 0;

    Jimp.read(imgbuffer.data)
        .then(function(image1) {
            var w = image1.bitmap.width;
            var h = image1.bitmap.height;
            var image = new Jimp(w, h, function(err, image) {
                image1.scan(0, 0, w, h, function(x, y, idx) {
                    try {
                        // x, y is the position of this pixel on the image
                        // idx is the position start position of this rgba tuple in the bitmap Buffer
                        // this is the image
                        var r = this.bitmap.data[idx + 0];
                        var g = this.bitmap.data[idx + 1];
                        var b = this.bitmap.data[idx + 2];
                        var a = this.bitmap.data[idx + 3];
                        if (byte_ind < num_bytes) {
                            if (dit_ind < num_digit) {
                                r = encodebitandColorValue(
                                    binarys[byte_ind].charAt(dit_ind),
                                    r
                                );

                                dit_ind++;
                                if (dit_ind == num_digit) {
                                    byte_ind++;
                                    dit_ind = 0;
                                }
                            }
                        }
                        var hx1 = Jimp.rgbaToInt(r, g, b, a);
                        //var hex2 = Jimp.rgbaToInt(rgba);
                        image.setPixelColor(hx1, x, y);
                    } catch (err) {
                        callback(undefined, err);
                    }
                    // rgba values run from 0 - 255
                    // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
                });

                try {
                    //var file2 = "./public/new_name." + image.getExtension();
                    //image.write(file2);
                    //var v1 = Jimp.rgbaToInt(255, 255, 0, 255);
                    //image.getPixelColor(x, y);      // returns the colour of that pixel e.g. 0xFFFFFFFF
                    image.getBase64(Jimp.MIME_PNG, function(err, data) {
                        callback(data, err);
                    });
                } catch (err) {
                    callback(undefined, err);
                }
            });
        })
        .catch(function(err) {
            callback(undefined, err);
        });
};

module.exports.decode = function(imgbuffer, callback) {
    var data_bytes = [];
    var num_digit = 7;

    var byte_ind = 0;
    var dit_ind = 0;
    var binary1 = "";

    var max_bytes = 5000000;
    var reading = true;
    Jimp.read(imgbuffer.data)
        .then(function(image1) {
            var w = image1.bitmap.width;
            var h = image1.bitmap.height;

            image1.scan(0, 0, w, h, function(x, y, idx) {
                try {
                    // x, y is the position of this pixel on the image
                    // idx is the position start position of this rgba tuple in the bitmap Buffer
                    // this is the image
                    if (byte_ind < max_bytes && reading == true) {
                        if (dit_ind < num_digit) {
                            var r = this.bitmap.data[idx + 0];
                            var g = this.bitmap.data[idx + 1];
                            var b = this.bitmap.data[idx + 2];
                            var a = this.bitmap.data[idx + 3];

                            var bit1 = decodebitandColorValue(r);
                            binary1 += "" + bit1;

                            dit_ind++;
                            if (dit_ind == num_digit) {
                                if (bin2char(binary1) == "}") {
                                    reading = false;
                                } else {
                                    data_bytes.push(binary1);

                                    binary1 = "";

                                    byte_ind++;
                                    dit_ind = 0;
                                }
                            }
                        }
                    }
                } catch (err) {
                    callback(undefined, err);
                }
                // rgba values run from 0 - 255
                // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
            });

            try {
                //var v1 = Jimp.rgbaToInt(255, 255, 0, 255);
                //image.getPixelColor(x, y);      // returns the colour of that pixel e.g. 0xFFFFFFFF
                var b64encoded = "";
                for (var i = 0; i < data_bytes.length; i++) {
                    b64encoded += bin2char(data_bytes[i]);
                }
                callback({
                        b64: b64encoded,
                        data: decodeBase64ToUTF(b64encoded)
                    },
                    undefined
                );
            } catch (err) {
                callback(undefined, err);
            }
        })
        .catch(function(err) {
            callback(undefined, err);
        });
};