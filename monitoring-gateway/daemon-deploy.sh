#!/bin/bash
set -e

### Configuration ###

APP_DIR=/home/$USER/
GIT_URL=https://github.com/ragoob/monitoring-tool.git
RESTART_ARGS=
PI_USER=$USER
export SOCKET_SERVER=http://192.168.1.7:4001
export MACHINE_ID={Daemon_GUID}
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
sudo npm install -g typescript
sudo npm install @types/node
sudo npm install -g rimraf
sudo npm install -g copyfiles
sudo npm install -g prettier
sudo npm install -g @nestjs/cli
# Install application
sudo npm install --production
sudo npm run build


## create systemd service ####
sudo rm -rf /lib/systemd/system/linux-machines-monitoring-daemon.service
sudo touch  /lib/systemd/system/linux-machines-monitoring-daemon.service
sudo  bash -c  'cat > /lib/systemd/system/linux-machines-monitoring-daemon.service << EOF
[Unit]
Description=montoring tool agent to send data to dashboard
Documentation=https://github.com/ragoob/monitoring-tool
After=network.target

[Service]
Environment=NODE_PORT=30003
Type=simple
User=$PI_USER
ExecStart=/usr/bin/node /home/$PI_USER/monitoring-tool/linux-machines-monitoring-daemon/dist/main
Restart=on-failure
[Install]
WantedBy=multi-user.target
EOF'

 sudo systemctl daemon-reload
 sudo systemctl start linux-machines-monitoring-daemon



