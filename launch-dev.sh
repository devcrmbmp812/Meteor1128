#!/bin/sh

APP_NAME="pmmdata-dev"
#BASE_DIR="/home/ec2-user/meteor-build"
BASE_DIR="/opt/bizarmobile/meteor-build"
BUILD_DIR="$BASE_DIR/pmdata/$APP_NAME"
PORT=3000
URL="http://bizdev.pmdata.com.au"
METEOR_SETTINGS="$(cat settings_dev.json)"

status_servers() {
        forever list 2>/dev/null
        return $?
}

start_servers() {
	export PORT=$PORT
	export DDP_DEFAULT_CONNECTION_URL=$URL
	export ROOT_URL=$URL
	export MONGO_URL=mongodb://dev-admin:dev_admin@localhost:27017/pmdata-dev?w=1
        export FOO=development
        export METEOR_SETTINGS=$METEOR_SETTINGS
        export IMAGES_DEV_PATH=/home/imagesbizdevpmda/public_html/
        forever start $APP_NAME.js 2>&1 >/dev/null
        forever list 2>/dev/null
        return $?
}

stop_servers() {
        forever stop $APP_NAME.js 2>&1 >/dev/null
        return $?
}


case "$1" in
        build)
                echo "building app in" . $BUILD_DIR
                meteor build $BUILD_DIR --directory
                cp launch-dev.sh $BUILD_DIR/bundle/launch.sh
                cd $BUILD_DIR/bundle/programs/server/
                npm install
                cd $BUILD_DIR/bundle
		mv main.js $APP_NAME.js
                echo "Stopping meteor server"
                stop_servers
                echo "Starting meteor server"
                start_servers
                ;;
        start)
                echo "Starting meteor server"
                cd $BUILD_DIR/bundle
                start_servers
                ;;
        stop)
                echo "Stopping meteor server"
                cd $BUILD_DIR/bundle
                stop_servers
                ;;
        restart)
                cd $BUILD_DIR/bundle
                echo "Stopping meteor server"
                stop_servers
                echo "Starting meteor server"
                start_servers
                ;;
        status)
                status_servers
                ;;
        *)
                echo "Usage: ${0} {start|stop|restart|status}"
                exit 1
                ;;
esac
exit 0
