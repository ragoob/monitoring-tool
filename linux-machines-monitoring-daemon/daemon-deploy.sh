#!/bin/bash
set -e

### Configuration ###

APP_DIR=/home/$USER/
GIT_URL=https://github.com/ragoob/monitoring-tool.git
RESTART_ARGS=
export SOCKET_SERVER=192.168.1.7:4001
export MACHINE_ID=9b130e3a-3a33-5709-ab3e-d7642231d236
export PORT=30003
### Installing Node ###
if which node > /dev/null
    then
        echo "node is installed, skipping..."
    else
      sudo apt-get -y install curl
      curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
      sudo apt-get -y install nodejs
    fi


### Automation steps ###
sudo rm -rf $APP_DIR/monitoring-tool
set -x

# clone code from github
 git clone $GIT_URL $APP_DIR/monitoring-tool
 cd $APP_DIR/monitoring-tool/linux-machines-monitoring-daemon

# Install dependencies
sudo npm i -g @nestjs/cli
sudo npm install --production
sudo npm run build


## create systemd service ####

sudo cat > /lib/systemd/system/linux-machines-monitoring-daemon.service << EOF
[Unit]
Description=montoring tool agent to send data to dashboard
Documentation=https://github.com/ragoob/monitoring-tool
After=network.target

[Service]
Environment=NODE_PORT=30003
Type=simple
User=$USER
ExecStart=/usr/bin/node /home/$USER/monitoring-tool/linux-machines-monitoring-daemon/dist/main.js
Restart=on-failure
[Install]
WantedBy=multi-user.target
EOF

 sudo systemctl daemon-reload
 sudo systemctl start linux-machines-monitoring-daemon



