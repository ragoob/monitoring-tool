package models

//AllowedMachines jsonP ...
type AllowedMachines map[string]interface{}

//User Model ..
type User struct {
	ID              int             `json:"id"`
	Email           string          `json:"email"`
	Password        string          `json:"password"`
	PasswordSalt    string          `json:"passwordSalt"`
	IsAdmin         bool            `json:"isAdmin"`
	AllowedMachines AllowedMachines `json:"allowedMachines"`
}
