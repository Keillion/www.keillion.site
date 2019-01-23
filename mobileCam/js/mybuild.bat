set mbc-version=2.1.3

del mbc-%mbc-version%.temp.js
del mbc-%mbc-version%.min.js

copy ..\..\js\kUtil.js mbc-%mbc-version%.temp.js
type ..\..\js\task-queue.js >> mbc-%mbc-version%.temp.js
type ..\..\js\exif.js >> mbc-%mbc-version%.temp.js
type kPainter.js >> mbc-%mbc-version%.temp.js
java -jar closure-compiler-v20170218.jar --js mbc-%mbc-version%.temp.js --js_output_file mbc-%mbc-version%.min0.js

copy mbc-head.js mbc-%mbc-version%.min.js
type mbc-%mbc-version%.min0.js >> mbc-%mbc-version%.min.js
del mbc-%mbc-version%.min0.js

pause
