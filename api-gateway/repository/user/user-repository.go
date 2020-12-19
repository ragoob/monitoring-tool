package userrepository

import (
	"api-gateway/models"
	"database/sql"
	"log"
)

//UserRepository repo
type UserRepository struct{}

//GetUsers list
func (u UserRepository) GetUsers(db *sql.DB, user models.User, users []models.User) ([]models.User, error) {
	rows, err := db.Query(`select id,email,"isAdmin" from users`)

	if err != nil {
		log.Fatal(err)
		return []models.User{}, err
	}

	for rows.Next() {
		err = rows.Scan(&user.ID, &user.Email, &user.IsAdmin)
		users = append(users, user)
	}

	if err != nil {
		log.Fatal(err)
		return []models.User{}, err
	}

	return users, nil
}

//GetUser by id
func (u UserRepository) GetUser(db *sql.DB, id int) (models.User, error) {
	var user models.User
	rows := db.QueryRow(`select id,email,"isAdmin",password, "passwordSalt" from users where id=$1`, id)
	err := rows.Scan(&user.ID, &user.Email, &user.IsAdmin, &user.Password, &user.PasswordSalt)

	return user, err
}

//GetUserByEmail by id
func (u UserRepository) GetUserByEmail(db *sql.DB, email string) (models.User, error) {
	var user models.User
	rows := db.QueryRow(`select id,email,"isAdmin",password, "passwordSalt" from users where email=$1`, email)
	err := rows.Scan(&user.ID, &user.Email, &user.IsAdmin, &user.Password, &user.PasswordSalt)

	return user, err
}

//AddUser ..
func (u UserRepository) AddUser(db *sql.DB, user models.User) (int, error) {
	err := db.QueryRow(`insert into users (email,"isAdmin",password,"passwordSalt") values($1,$2,$3,$4) RETURNING id;`,
		user.Email, user.IsAdmin, user.Password, user.PasswordSalt).Scan(&user.ID)

	if err != nil {
		log.Fatal(err)
		return 0, err
	}

	return user.ID, nil
}

//UpdateUser ..
func (u UserRepository) UpdateUser(db *sql.DB, user models.User) (int64, error) {
	result, err := db.Exec(`update users set email=$1,"isAdmin"=$2,password=$3,"passwordSalt"=$4 where id=$5`,
		user.Email, user.IsAdmin, user.Password, user.PasswordSalt, user.ID)

	if err != nil {
		return 0, err
	}

	rowsUpdated, err := result.RowsAffected()

	if err != nil {
		return 0, err
	}

	return rowsUpdated, nil
}

//RemoveUser ..
func (u UserRepository) RemoveUser(db *sql.DB, id int) (int64, error) {
	result, err := db.Exec("delete from users where id = $1", id)

	if err != nil {
		return 0, err
	}

	rowsDeleted, err := result.RowsAffected()

	if err != nil {
		return 0, err
	}

	return rowsDeleted, nil
}
