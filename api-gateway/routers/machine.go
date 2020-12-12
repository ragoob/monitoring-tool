package routers

import (
	"api-gateway/controllers"
	"database/sql"

	"github.com/gorilla/mux"
)

//MachineRouter ...
type MachineRouter struct{}

//Handle routers
func (machine MachineRouter) Handle(router *mux.Router, db *sql.DB) {
	machineController := controllers.MachineController{}
	router.HandleFunc("/machine", machineController.GetMachines(db)).Methods("GET")
	router.HandleFunc("/machine/{id}", machineController.GetMachine(db)).Methods("GET")
	router.HandleFunc("/machine", machineController.AddMachine(db)).Methods("POST")
	router.HandleFunc("/machine", machineController.EditMachine(db)).Methods("PUT")
	router.HandleFunc("/machine/{id}", machineController.RemoveMachine(db)).Methods("DELETE")
}
