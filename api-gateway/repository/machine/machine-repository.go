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
