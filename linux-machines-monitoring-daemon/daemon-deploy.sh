#!/bin/bash
set -e

### Configuration ###

APP_DIR=/var/www/docker-daemon
GIT_URL=git://github.com/ragoob/docker-metrics-daemon
RESTART_ARGS=



### Automation steps ###

set -x

# Pull latest code
if [[ -e $APP_DIR/docker-metrics-daemon ]]; then
  cd $APP_DIR/docker-metrics-daemon
  git pull
else
  git clone $GIT_URL $APP_DIR
  cd $APP_DIR/docker-metrics-daemon
fi

# Install dependencies
npm install --production
npm prune --production

# Restart app
passenger-config restart-app --ignore-app-not-running --ignore-passenger-not-running $RESTART_ARGS $APP_DIR/docker-metrics-daemon

