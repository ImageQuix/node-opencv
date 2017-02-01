"use strict";

var exec = require("child_process").exec;
var fs = require("fs");
var flag = process.argv[2] || "--exists";

// Normally |pkg-config opencv ...| could report either OpenCV 2.x or OpenCV 3.y
// depending on what is installed.  To enable both 2.x and 3.y to co-exist on
// the same machine, the opencv.pc for 3.y can be installed as opencv3.pc and
// then selected by |export PKG_CONFIG_OPENCV3=1| before building node-opencv.
var opencv = process.env.PKG_CONFIG_OPENCV3 === "1" ? "opencv3" : '"opencv >= 2.3.1"';

function main(){
    if (process.platform !== "win32") {
        var path = process.env.OPENCV_DIR;
        if (path[path.length - 1] === '/') {
            path = path.substr(0, path.length - 1);
        }

        if (flag === '--libs') {
            console.log(`-L${path}/lib -L${path}/share/OpenCV/3rdparty/lib -lopencv_contrib -lopencv_stitching -lopencv_nonfree -lopencv_superres -lopencv_ocl -lopencv_ts -lopencv_videostab -lopencv_gpu -lopencv_photo -lopencv_objdetect -lopencv_legacy -lopencv_video -lopencv_ml -lopencv_calib3d -lopencv_features2d -lopencv_highgui -lIlmImf -llibtiff -llibpng -llibjpeg -lopencv_imgproc -lopencv_flann -lopencv_core -lzlib -framework OpenCL -framework AppKit -framework QuartzCore -framework QTKit -framework Cocoa -lstdc++`);
        } else if (flag === '--cflags') {
            console.log(`-I${path}/include/opencv -I${path}/include`);
        }
    }
    else {
        fallback();
    }
}

//======================Windows Specific=======================================

function fallback(){
    exec("echo %OPENCV_DIR%", function(error, stdout, stderr){
        stdout = cleanupEchoOutput(stdout);
        if(error){
            throw new Error("ERROR: There was an error reading OPENCV_DIR");
        }
        else if(stdout === "%OPENCV_DIR%") {
            throw new Error("ERROR: OPENCV_DIR doesn't seem to be defined");
        }
        else {
            printPaths(stdout);
        }
    });
}

function printPaths(opencvPath){
    if(flag === "--cflags") {
        console.log("\"" + opencvPath + "\\..\\..\\include\"");
        console.log("\"" + opencvPath + "\\..\\..\\include\\opencv\"");
    }
    else if(flag === "--libs") {
        var libPath = opencvPath + "\\staticlib\\";

        fs.readdir(libPath, function(err, files){
            if(err){
                throw new Error("ERROR: couldn't read the lib directory " + err);
            }

            var libs = "";
            for(var i = 0; i < files.length; i++){
                if(getExtension(files[i]) === "lib"){
                    libs = libs + " \"" + libPath + files[i] + "\" \r\n ";
                }
            }
            libs += " \"" + "vfw32.lib" + "\" \r\n ";
            console.log(libs);
        });
    }
    else {
        throw new Error("Error: unknown argument '" + flag + "'");
    }
}

function cleanupEchoOutput(s){
    return s.slice(0, s.length - 2);
}

function getExtension(s){
    return s.substr(s.lastIndexOf(".") + 1);
}
main();
