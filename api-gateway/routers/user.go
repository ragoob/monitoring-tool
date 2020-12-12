package routers

import (
	"api-gateway/controllers"
	"database/sql"

	"github.com/gorilla/mux"
)

//UserRouter ...
type UserRouter struct{}

//Handle routers
func (user UserRouter) Handle(router *mux.Router, db *sql.DB) {
	userController := controllers.UserController{}
	router.HandleFunc("/user", userController.GetUsers(db)).Methods("GET")
	router.HandleFunc("/user/{id}", userController.GetUser(db)).Methods("GET")
	router.HandleFunc("/user", userController.AddUser(db)).Methods("POST")

}
