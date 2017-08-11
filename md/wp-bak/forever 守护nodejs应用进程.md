```
#! /bin/bash

DIR=/home/dash/__placeholder__
LOG_FOLDER=$DIR/log
DATE=`date +%Y%m%d`

mkdir -p $LOG_FOLDER

case "$1" in
start)
PORT=9380 NODE_ENV=production forever start -a -l $LOG_FOLDER/__placeholder__.log -o $LOG_FOLDER/out.log -e $LOG_FOLDER/err.log $DIR/app.js
;;
stop)
forever stop $DIR/app.js
;;
restart)
$0 stop
$0 start
;;
status)
;;
reload)
;;
*)
echo "Usage: $0 {start|stop|restart}"
exit 1
;;
esac
exit 0

```