package services

import (
	"fmt"

	socketio "github.com/googollee/go-socket.io"
	"github.com/gorilla/mux"
)

//SocketService handler
type SocketService struct{}

//Handle connection ...
func (s SocketService) Handle(router *mux.Router) {

	server, err := socketio.NewServer(nil)

	if err != nil {
		fmt.Println(err)
	}
	server.OnConnect("/", func(s socketio.Conn) error {
		fmt.Println("connected:", s.ID())
		s.SetContext("")

		return nil
	})

	go server.Serve()
	//defer server.Close()
	router.Handle("/socket.io/", server)
}
