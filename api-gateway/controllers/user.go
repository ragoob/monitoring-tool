package controllers

import (
	"api-gateway/models"
	userrepository "api-gateway/repository/user"
	"api-gateway/utils"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

//UserController ..
type UserController struct{}

var users []models.User

//GetUsers Handler
func (c UserController) GetUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user models.User
		var error models.Error

		users = []models.User{}
		userRepo := userrepository.UserRepository{}
		users, err := userRepo.GetUsers(db, user, users)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		utils.SendSuccess(w, users)

	}
}

//GetUser By id ...
func (c UserController) GetUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		var user models.User
		var error models.Error
		userRepo := userrepository.UserRepository{}
		id, _ := strconv.Atoi(params["id"])

		user, err := userRepo.GetUser(db, id)
		if err != nil {
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		utils.SendSuccess(w, user)

	}
}

//AddUser Handler
func (c UserController) AddUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user models.User
		var userID int
		var error models.Error
		json.NewDecoder(r.Body).Decode(&user)

		if user.Email == "" || user.Password == "" {
			error.Message = "Enter missing fields."
			utils.SendError(w, http.StatusBadRequest, error) //400
			return
		}

		passwordSalt, salterr := utils.GenerateRandomSalt(16)
		if salterr != nil {
			logFatal(salterr)
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error) //500
			return
		}
		hashedPassword := utils.HashPassword(user.Password, passwordSalt)

		user.PasswordSalt = hex.EncodeToString(passwordSalt)
		user.Password = hashedPassword

		userRepo := userrepository.UserRepository{}
		userID, err := userRepo.AddUser(db, user)

		if err != nil {
			logFatal(err)
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error) //500
			return
		}

		w.Header().Set("Content-Type", "text/plain")
		utils.SendSuccess(w, userID)
	}
}

//EditUser Handler
func (c UserController) EditUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user models.User
		var rowsAffected int64
		var error models.Error
		json.NewDecoder(r.Body).Decode(&user)

		if user.ID <= 0 || user.Email == "" {
			error.Message = "Enter missing fields."
			utils.SendError(w, http.StatusBadRequest, error) //400
			return
		}
		userRepo := userrepository.UserRepository{}

		// If password changed re-generate new hash
		if user.Password != "" {
			passwordSalt, salterr := utils.GenerateRandomSalt(16)
			if salterr != nil {
				logFatal(salterr)
				error.Message = "Server error"
				utils.SendError(w, http.StatusInternalServerError, error) //500
				return
			}
			hashedPassword := utils.HashPassword(user.Password, passwordSalt)

			user.PasswordSalt = hex.EncodeToString(passwordSalt)
			user.Password = hashedPassword
		} else {
			_user, _ := userRepo.GetUser(db, user.ID)

			user.Password = _user.Password
			user.PasswordSalt = _user.PasswordSalt
		}

		rowsAffected, err := userRepo.UpdateUser(db, user)

		if err != nil {
			logFatal(err)
			error.Message = "Server error"
			utils.SendError(w, http.StatusInternalServerError, error) //500
			return
		}

		w.Header().Set("Content-Type", "text/plain")
		utils.SendSuccess(w, rowsAffected)
	}
}

//RemoveUser Handler ..
func (c UserController) RemoveUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var error models.Error
		params := mux.Vars(r)
		userRepo := userrepository.UserRepository{}

		id, _ := strconv.Atoi(params["id"])
		rowsDeleted, err := userRepo.RemoveUser(db, id)

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
