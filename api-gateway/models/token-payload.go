package models

//TokenPayLoad ..
type TokenPayLoad struct {
	Email string `json:"email"`
	Token string `json:"accessToken"`
}
