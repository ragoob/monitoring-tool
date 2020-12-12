package machinerepository

import (
	"api-gateway/models"
	"database/sql"
	"log"
)

//MachineRepository repo
type MachineRepository struct{}

//GetMachines list
func (m MachineRepository) GetMachines(db *sql.DB, machine models.Machine, machines []models.Machine) ([]models.Machine, error) {
	rows, err := db.Query("select id,name from machines")

	if err != nil {
		return []models.Machine{}, err
	}

	for rows.Next() {
		err = rows.Scan(&machine.ID, &machine.Name)
		machines = append(machines, machine)
	}

	if err != nil {
		log.Fatal(err)
		return []models.Machine{}, err
	}

	return machines, nil
}

//GetMachine by id
func (m MachineRepository) GetMachine(db *sql.DB, machine models.Machine, id string) (models.Machine, error) {
	rows := db.QueryRow("select id,name from machines where id=$1", id)
	err := rows.Scan(&machine.ID, &machine.Name)

	return machine, err
}

//AddMachine ..
func (m MachineRepository) AddMachine(db *sql.DB, machine models.Machine) (string, error) {
	err := db.QueryRow("insert into machines (name) values($1) RETURNING id;",
		machine.Name).Scan(&machine.ID)

	if err != nil {
		return "", err
	}

	return machine.ID, nil
}

//UpdateMachine ..
func (m MachineRepository) UpdateMachine(db *sql.DB, machine models.Machine) (int64, error) {
	result, err := db.Exec("update machines set name=$1 where id=$4 RETURNING id",
		&machine.Name, &machine.ID)

	if err != nil {
		return 0, err
	}

	rowsUpdated, err := result.RowsAffected()

	if err != nil {
		return 0, err
	}

	return rowsUpdated, nil
}

//RemoveMachine ..
func (m MachineRepository) RemoveMachine(db *sql.DB, id int) (int64, error) {
	result, err := db.Exec("delete from machines where id = $1", id)

	if err != nil {
		return 0, err
	}

	rowsDeleted, err := result.RowsAffected()

	if err != nil {
		return 0, err
	}

	return rowsDeleted, nil
}
