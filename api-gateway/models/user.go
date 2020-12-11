package models

type User struct {
	id              int
	email           string
	password        string
	passwordSalt    string
	isAdmin         bool
	allowedMachines string
}
