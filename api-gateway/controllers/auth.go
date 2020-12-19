package controllers

import (
	"api-gateway/models"
	userrepository "api-gateway/repository/user"
	"api-gateway/utils"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

//AuthController ...
type AuthController struct{}

//Login handler
func (c AuthController) Login(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var error models.Error
		var payLoad models.Login
		var user models.User
		var tokenPayload models.TokenPayLoad
		userRepo := userrepository.UserRepository{}

		json.NewDecoder(r.Body).Decode(&payLoad)

		if payLoad.UserName == "" || payLoad.Password == "" {
			error.Message = "Enter missing fields user name and password."
			utils.SendError(w, http.StatusBadRequest, error) //400
			return
		}

		user, err := userRepo.GetUserByEmail(db, payLoad.UserName)
		if err != nil || user.ID == 0 {
			fmt.Println(err)
			error.Message = "Invalid user name or password."
			utils.SendError(w, http.StatusBadRequest, error) //400
			return
		}

		salt, _ := hex.DecodeString(user.PasswordSalt)

		if !utils.DoPasswordsMatch(user.Password, payLoad.Password, salt) {
			fmt.Println("password matching err")
			error.Message = "Invalid user name or password."
			utils.SendError(w, http.StatusBadRequest, error) //400
			return
		}

		token, err := createToken(user)

		if err != nil {
			fmt.Println(err)
			error.Message = "Invalid user name or password."
			utils.SendError(w, http.StatusBadRequest, error) //400
			return
		}

		tokenPayload.Email = user.Email
		tokenPayload.Token = token

		w.Header().Set("Content-Type", "application/json")
		utils.SendSuccess(w, tokenPayload)
	}
}

//CreateToken ..
func createToken(user models.User) (string, error) {
	var err error

	atClaims := jwt.MapClaims{}
	atClaims["email"] = user.Email
	atClaims["isAdmin"] = user.IsAdmin
	atClaims["exp"] = time.Now().Add(time.Hour * 720).Unix()
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	token, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return "", err
	}
	return token, nil
}
