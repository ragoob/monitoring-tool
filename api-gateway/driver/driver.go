package driver

import (
	"database/sql"
	"log"
	"os"

	"github.com/lib/pq"
)

var db *sql.DB

func logFatal(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func ConnectDB() *sql.DB {
	conn, err := pq.ParseURL(os.Getenv("DB_CONNECTION_URL"))
	logFatal(err)

	db, err = sql.Open("postgres", conn)
	logFatal(err)

	err = db.Ping()
	logFatal(err)

	return db
}
