rem copy ..\js\jquery-3.2.1.min.js js\jquery-3.2.1.min.js
rem copy ..\css\cssReset.css css\cssReset.css
rem copy ..\mobileCam\css\kPainter.css css\kPainter.css

copy ..\js\kUtil.js js\mbc-2.1.2.js
type ..\js\task-queue.js >> js\mbc-2.1.2.js
type ..\js\exif.js >> js\mbc-2.1.2.js
type ..\mobileCam\js\kPainter.js >> js\mbc-2.1.2.js
java -jar closure-compiler-v20170218.jar --js js\mbc-2.1.2.js --js_output_file js\mbc-2.1.2.min.js

rem java -jar closure-compiler-v20170218.jar --js ..\mobileCam\js\cv-wasm.js --js_output_file js\cv-wasm.js
rem copy ..\mobileCam\js\cv-wasm.wasm js\cv-wasm.wasm

pause
