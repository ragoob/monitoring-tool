package routers

import (
	"api-gateway/controllers"
	"database/sql"

	"github.com/gorilla/mux"
)

//AuthRouter ...
type AuthRouter struct{}

//Handle routers
func (auth AuthRouter) Handle(router *mux.Router, db *sql.DB) {
	authController := controllers.AuthController{}
	router.HandleFunc("/auth/token", authController.Login(db)).Methods("POST")

}
