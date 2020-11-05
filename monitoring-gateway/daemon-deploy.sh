#!/bin/bash
set -e

### Configuration ###

APP_DIR=/home/$USER/
echo $APP_DIR
sudo apt install -y git-all
GIT_URL=https://github.com/ragoob/monitoring-tool.git
export SOCKET_SERVER=http://192.168.1.7:4001
export MACHINE_ID={Daemon_GUID}
export PORT=30003
### Installing Node ###
 sudo apt-get -y install curl
      curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
      sudo apt-get -y install nodejs


### Automation steps ###
sudo rm -rf $APP_DIR/monitoring-tool
set -x
cd  $APP_DIR/monitoring-tool
curl -L https://github.com/ragoob/monitoring-tool/blob/main/linux-machines-monitoring-daemon/build.tar.gz?raw=true | tar zx

sudo rm -rf /usr/bin/linux-machines-monitoring-daemon
sudo mkdir /usr/bin/linux-machines-monitoring-daemon
sudo cp -a build/dist  /usr/bin/linux-machines-monitoring-daemon/dist
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
Environment=SOCKET_SERVER={Daemon_URL}
Type=simple
User=$USER
ExecStart=$(which node)  /usr/bin/linux-machines-monitoring-daemon/dist/main
Restart=on-failure
[Install]
WantedBy=multi-user.target
EOF'

 sudo systemctl daemon-reload
  sudo systemctl enable linux-machines-monitoring-daemon
  sudo systemctl start linux-machines-monitoring-daemon



