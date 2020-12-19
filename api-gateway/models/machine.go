package models

//Config jsonP ...
type Config map[string]interface{}

//Machine model
type Machine struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Config Config `json:"config"`
}
