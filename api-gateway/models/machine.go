package models

//Config jsonP ...
type Config map[string]interface{}

//Machine model
type Machine struct {
	ID     string
	Name   string
	Config Config
}
