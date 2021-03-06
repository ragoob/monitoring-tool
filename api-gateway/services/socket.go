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

//PayLoad Socket client ..
type PayLoad struct {
	MachineID string      `json:"machineId"`
	Data      interface{} `json:"data"`
}

//Handle connection ...
func (s SocketService) Handle(router *mux.Router) {
	server := gosocketio.NewServer(transport.GetDefaultWebsocketTransport())

	server.On(gosocketio.OnConnection, func(s *gosocketio.Channel) {
		fmt.Println(s.Id() + " is Connected")
		server.On(HEALTH_CHECK, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll("ui-"+HEALTH_CHECK, msg)
		})

		server.On(SUMMARY, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll("ui-"+SUMMARY, msg)

		})

		server.On(TEMPERATURE, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll("ui-"+TEMPERATURE, msg)

		})

		server.On(MEMORY_USAGE, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll("ui-"+MEMORY_USAGE, msg)

		})

		server.On(CPU_USAGE, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll("ui-"+CPU_USAGE, msg)

		})

		server.On(DISK_USAGE, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll("ui-"+DISK_USAGE, msg)

		})

		server.On(CONTAINERS_METRICS, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll("ui-"+CONTAINERS_METRICS, msg)

		})

		server.On(CONTAINERS_LIST, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll("ui-"+CONTAINERS_LIST, msg)

		})

		server.On(DOCKER_ENGINE_INFO, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll("ui-"+DOCKER_ENGINE_INFO, msg)

		})
		server.On("ui-"+CONTAINER_START, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll(DOCKER_ENGINE_INFO, msg)

		})
		server.On("ui-"+CONTAINER_RESTART, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll(CONTAINER_RESTART, msg)

		})

		server.On("ui-"+CONTAINER_STOP, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll(CONTAINER_STOP, msg)

		})

		server.On("ui-"+CONTAINER_DELETE, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll(CONTAINER_DELETE, msg)

		})

		server.On("ui-"+DOCKER_RUN_IMAGE, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll(DOCKER_RUN_IMAGE, msg)

		})
		server.On("ui-"+ASK_CONTAINER_LOGS, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll(ASK_CONTAINER_LOGS, msg)

		})

		server.On(CONTAINER_LOGS, func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll(CONTAINER_LOGS, msg)

		})

		server.On("ui-shutdown", func(c *gosocketio.Channel, msg PayLoad) {
			server.BroadcastToAll("shutdown", msg)

		})

	})

	server.On(gosocketio.OnError, func(c *gosocketio.Channel) {
		fmt.Println("Error occurs")
	})

	router.Handle("/socket.io/", server)

}
