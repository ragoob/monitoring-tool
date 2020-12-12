package services

import (
	"fmt"

	"github.com/gorilla/mux"
	gosocketio "github.com/graarh/golang-socketio"
	"github.com/graarh/golang-socketio/transport"
)

//SocketService handler
type SocketService struct{}

//Handle connection ...
func (s SocketService) Handle(router *mux.Router) {
	server := gosocketio.NewServer(transport.GetDefaultWebsocketTransport())
	server.On(gosocketio.OnConnection, func(c *gosocketio.Channel) {
		fmt.Println(c.Id() + " is Connected")
	})

	server.On("SUMMARY", func(c *gosocketio.Channel, msg string) {

		fmt.Println(msg)

	})

	server.On("TEMPERATURE", func(c *gosocketio.Channel, msg string) {

		fmt.Println(msg)

	})

	router.Handle("/socket.io/", server)

}
