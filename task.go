package main

type Task struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	DueDate  string `json:"dueDate"`
	Priority int    `json:"priority"`
	Done     bool   `json:"done"`
}
