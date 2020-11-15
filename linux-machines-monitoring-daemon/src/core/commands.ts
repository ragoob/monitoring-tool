export const INSPECT_DOCKER_CONTAINERS = 'docker inspect  $(docker ps -aq)';
export const RESTART_CONTAINER= 'docker update --restart';
export const CONTAINER_START = 'docker start';
export const CONTAINER_STOP = 'docker stop';
export const REMOVE_CONTAINER = 'docker rm -f';
export const CONTAINER_LOGS = 'docker logs';
export const CONTAINER_METERCIS= 'docker stats --no-stream --format=\'{{json .}}\'';
export const DOCKER_RUN_IMAGE = 'docker run';
export const DOCKER_INFO = 'docker info   --format=\'{{json .}}\'';
export const MEMORY_USAGE = 'free -m';
export const DISK_USAGE = 'df -h /';
export const CPU_USAGE=  "top -bn1 | sed -n '/Cpu/p' | awk '{print $2}' | sed 's/..,//'"