package controllers

import (
	"api-gateway/models"
	machinerepository "api-gateway/repository/machine"
	"api-gateway/utils"
	"database/sql"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

//MachineController ...
type MachineController struct{}

var machines []models.Machine

func logFatal(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

//GetMachines Handler
func (c MachineController) GetMachines(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var machine models.Machine
		var error models.Error

		machines = []models.Machine{}
		machineRepo := machinerepository.MachineRepository{}
		machines, err := machineRepo.GetMachines(db, machine, machines)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		utils.SendSuccess(w, machines)

	}
}

//GetMachine By id ...
func (c MachineController) GetMachine(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		var machine models.Machine
		var error models.Error
		machineRepo := machinerepository.MachineRepository{}
		machine, err := machineRepo.GetMachine(db, machine, params["id"])
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		utils.SendSuccess(w, machine)

	}
}
