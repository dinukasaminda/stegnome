/*
var handleFileSelect = function(evt) {
    var files = evt.target.files;
    var file = files[0];
    if (files && file) {
        var reader = new FileReader();
        reader.onload = function(readerEvt) {
            binaryString = readerEvt.target.result;
            console.log(JSON.stringify(binaryString));
        };
        reader.readAsBinaryString(file);
    }
};



if (window.File && window.FileReader && window.FileList && window.Blob) {
    document
        .getElementById("1exampleInputFile121")
        .addEventListener("change", handleFileSelect, false);
} else {
    console.log("The File APIs are not fully supported in this browser.");
}*/
var bs64String1;
$("#imgfile1_prnt").on("change", "#exampleInputFile121", function(e) {
    var files = e.target.files;
    var file = files[0];
    if (files && file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            bs64String1 = reader.result;
        };
        reader.onerror = function(error) {};
    }
});

var bs64String2;

$("#imgfile2_prnt").on("change", "#filetodecode123", function(e) {
    var files = e.target.files;
    var file = files[0];
    if (files && file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            bs64String2 = reader.result;
        };
        reader.onerror = function(error) {};
    }
});

function encode_() {
    var data_base64 = $("#inputbase64data3").val();
    if (data_base64.length > 1 && bs64String1.length > 1) {
        reqdata = {
            data: {
                imgbase64: "" + bs64String1,
                data_base64: "" + data_base64
            }
        };
        $("#imgencodedurl").addClass("hidden_cls");
        $("#imgencodedurl").removeClass("show_cls");
        $.ajax({
            type: "POST",
            url: "/encode",
            data: JSON.stringify(reqdata),
            success: function(data) {
                if (data.msgcode == 2000) {
                    console.log("ok");
                    var url1 = data.imgbase64.replace(
                        /^data:image\/[^;]+/,
                        "data:application/octet-stream"
                    );
                    $("#imgencodedurl").addClass("show_cls");
                    $("#imgencodedurl").removeClass("hidden_cls");

                    $("#imgencodedurl").attr("href", url1);
                    $("#imgencodedurl").attr("download", data.imgpath);
                }
            },
            contentType: "application/json",
            dataType: "json"
        });
    }
}

function decode_() {
    if (bs64String2.length > 1) {
        reqdata = {
            data: {
                imgbase64: "" + bs64String2
            }
        };
        $("#data_view").addClass("hidden_cls");
        $("#data_view").removeClass("show_cls");
        $.ajax({
            type: "POST",
            url: "/decode",
            data: JSON.stringify(reqdata),
            success: function(data) {
                if (data.msgcode == 2000) {
                    console.log("ok");

                    $("#data_view").addClass("show_cls");
                    $("#data_view").removeClass("hidden_cls");

                    $("#output_bs64text").val(data.base64data);
                    $("#outputbase64decode").val(data.textData);
                }
            },
            contentType: "application/json",
            dataType: "json"
        });
    }
}