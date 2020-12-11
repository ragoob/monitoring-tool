package main

import (
	"api-gateway/driver"
	"api-gateway/routers"
	"api-gateway/services"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/subosito/gotenv"
)

var db *sql.DB

func init() {
	gotenv.Load()
}

func main() {
	db = driver.ConnectDB()
	router := mux.NewRouter()
	machineRouter := routers.MachineRouter{}
	wsService := services.SocketService{}

	router.HandleFunc("/", helloHandler).Methods("GET")
	router.HandleFunc("/ws", wsService.WsEndPoint())
	machineRouter.Handle(router, db)
	fmt.Println("Server is running at port " + os.Getenv("LISTEN_PORT"))
	log.Fatal(http.ListenAndServe(os.Getenv("LISTEN_PORT"), handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}), handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"}),
		handlers.AllowedOrigins([]string{"*"}))(router)))
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode("App is running")
}
