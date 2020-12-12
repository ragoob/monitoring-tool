package services

import (
	"fmt"

	"github.com/gorilla/mux"
	gosocketio "github.com/graarh/golang-socketio"
	"github.com/graarh/golang-socketio/transport"
)

const (
	CONTAINERS_LIST    = "CONTAINERS_LIST"
	CONTAINERS_METRICS = "CONTAINERS_METRICS"
	MEMORY_USAGE       = "MEMORY_USAGE"
	DISK_USAGE         = "DISK_USAGE"
	DOCKER_ENGINE_INFO = "DOCKER_ENGINE_INFO"
	TEMPERATURE        = "TEMPERATURE"
	HEALTH_CHECK       = "HEALTH_CHECK"
	CONTAINER_START    = "CONTAINER_START"
	CONTAINER_RESTART  = "CONTAINER_RESTART"
	CONTAINER_STOP     = "CONTAINER_STOP"
	CONTAINER_DELETE   = "CONTAINER_DELETE"
	CONTAINER_DETAILS  = "CONTAINER_DETAILS"
	DOCKER_RUN_IMAGE   = "DOCKER_RUN_IMAGE"
	CPU_USAGE          = "CPU_USAGE"
	ASK_CONTAINER_LOGS = "ASK_CONTAINER_LOGS"
	CONTAINER_LOGS     = "CONTAINER_LOGS"
	SUMMARY            = "SUMMARY"
)

//SocketService handler
type SocketService struct{}

//Handle connection ...
func (s SocketService) Handle(router *mux.Router) {
	server := gosocketio.NewServer(transport.GetDefaultWebsocketTransport())
	server.On(gosocketio.OnConnection, func(c *gosocketio.Channel) {
		fmt.Println(c.Id() + " is Connected")
	})

	server.On(SUMMARY, func(c *gosocketio.Channel, msg string) {

		fmt.Println(msg)

	})

	server.On(TEMPERATURE, func(c *gosocketio.Channel, msg string) {

		fmt.Println(msg)

	})

	router.Handle("/socket.io/", server)

}
