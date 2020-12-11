package services

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

//SocketService handler
type SocketService struct{}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func reader(conn *websocket.Conn) {
	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		log.Println(string(p))

	}
}

//WsEndPoint ...
func (s SocketService) WsEndPoint() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		upgrader.CheckOrigin = func(r *http.Request) bool {
			return true //will handle origin later
		}

		ws, err := upgrader.Upgrade(w, r, nil)

		if err != nil {
			log.Println(err)
		}

		log.Println("Client successfully connected")

		reader(ws)
	}
}
