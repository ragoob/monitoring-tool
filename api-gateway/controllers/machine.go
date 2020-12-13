package controllers

import (
	"api-gateway/models"
	machinerepository "api-gateway/repository/machine"
	"api-gateway/utils"
	"database/sql"
	"encoding/json"
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
		if !utils.IsAuthorized(r) {
			error.Message = "unauthorized access"
			utils.SendError(w, http.StatusUnauthorized, error)
			return
		}

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

//AddMachine Handler
func (c MachineController) AddMachine(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var machine models.Machine
		var error models.Error

		if !utils.IsAuthorized(r) {
			error.Message = "unauthorized access"
			utils.SendError(w, http.StatusUnauthorized, error)
			return
		}

		json.NewDecoder(r.Body).Decode(&machine)

		if machine.Name == "" {
			error.Message = "Enter missing fields."
			utils.SendError(w, http.StatusBadRequest, error) //400
			return
		}

		machineRepo := machinerepository.MachineRepository{}
		machineID, err := machineRepo.AddMachine(db, machine)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error) //500
			return
		}

		machine.ID = machineID

		w.Header().Set("Content-Type", "application/json")
		utils.SendSuccess(w, machine)
	}
}

//EditMachine Handler
func (c MachineController) EditMachine(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var machine models.Machine
		//var rowAffected int64
		var error models.Error
		if !utils.IsAuthorized(r) {
			error.Message = "unauthorized access"
			utils.SendError(w, http.StatusUnauthorized, error)
			return
		}
		json.NewDecoder(r.Body).Decode(&machine)

		if machine.Name == "" || machine.ID == "" {
			error.Message = "Enter missing fields."
			utils.SendError(w, http.StatusBadRequest, error) //400
			return
		}

		machineRepo := machinerepository.MachineRepository{}
		_, err := machineRepo.UpdateMachine(db, machine)

		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error) //500
			return
		}

		w.Header().Set("Content-Type", "application/json")
		utils.SendSuccess(w, machine)
	}
}

//RemoveMachine Handler ..
func (c MachineController) RemoveMachine(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var error models.Error
		if !utils.IsAuthorized(r) {
			error.Message = "unauthorized access"
			utils.SendError(w, http.StatusUnauthorized, error)
			return
		}
		params := mux.Vars(r)
		machineRepo := machinerepository.MachineRepository{}

		rowsDeleted, err := machineRepo.RemoveMachine(db, params["id"])

		if err != nil {
			error.Message = "Server error."
			utils.SendError(w, http.StatusInternalServerError, error) //500
			return
		}

		if rowsDeleted == 0 {
			error.Message = "Not Found"
			utils.SendError(w, http.StatusNotFound, error) //404
			return
		}

		w.Header().Set("Content-Type", "text/plain")
		utils.SendSuccess(w, rowsDeleted)
	}
}
