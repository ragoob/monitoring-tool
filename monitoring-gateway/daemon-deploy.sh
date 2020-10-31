#!/bin/bash
set -e

### Configuration ###

APP_DIR=/home/$USER/
echo $APP_DIR
GIT_URL=https://github.com/ragoob/monitoring-tool.git
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
# Install application
sudo npm install --production
 npm run build
sudo rm -rf /usr/bin/linux-machines-monitoring-daemon
sudo mkdir /usr/bin/linux-machines-monitoring-daemon
sudo cp -a dist  /usr/bin/linux-machines-monitoring-daemon/dist
sudo cp -a node_modules  /usr/bin/linux-machines-monitoring-daemon/node_modules
sudo rm -rf $APP_DIR/monitoring-tool
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
Environment=MACHINE_ID={Daemon_GUID}
Environment=NODE_ENV=production
Environment=SOCKET_SERVER=http://192.168.1.7:4001
Type=simple
User=$USER
ExecStart=/usr/bin/node  /usr/bin/linux-machines-monitoring-daemon/dist/main
Restart=on-failure
[Install]
WantedBy=multi-user.target
EOF'

 sudo systemctl daemon-reload
  sudo systemctl enable linux-machines-monitoring-daemon
  sudo systemctl start linux-machines-monitoring-daemon



