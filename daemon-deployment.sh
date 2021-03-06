#!/bin/bash
set -e

### Configuration ###

APP_DIR=/home/pi
echo $APP_DIR
### Installing Node ###
#  sudo apt-get -y install curl
#       curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
#       sudo apt-get -y install nodejs

### Automation steps ###
sudo rm -rf $APP_DIR/monitoring-tool
mkdir  $APP_DIR/monitoring-tool
set -x
cd  $APP_DIR/monitoring-tool
curl -k -L {SERVER_URL}/machine/deamonBuild/download | tar zx

sudo rm -rf /usr/bin/linux-machines-monitoring-daemon
sudo mkdir /usr/bin/linux-machines-monitoring-daemon
sudo cp -a build/dist  /usr/bin/linux-machines-monitoring-daemon/dist
sudo rm -rf $APP_DIR/monitoring-tool
## create systemd service ####
# sudo systemctl stop linux-machines-monitoring-daemon
# sudo systemctl disable linux-machines-monitoring-daemon
sudo rm -rf /lib/systemd/system/linux-machines-monitoring-daemon.service
sudo touch  /lib/systemd/system/linux-machines-monitoring-daemon.service
sudo systemctl daemon-reload
sudo systemctl reset-failed

sudo  bash -c  'cat > /lib/systemd/system/linux-machines-monitoring-daemon.service << EOF
[Unit]
Description=montoring tool agent to send data to dashboard
Documentation=https://github.com/ragoob/monitoring-tool
After=network.target
[Service]
Environment=NODE_PORT=30003
Environment=MACHINE_ID={Daemon_GUID}
Environment=NODE_ENV=production
Environment=SOCKET_SERVER={SOCKET_SERVER_URL}
Environment=GATE_WAY_URL={SERVER_URL}
Environment=NODE_TLS_REJECT_UNAUTHORIZED='0'
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