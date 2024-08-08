package main

import (
	"context"
	"embed"
	"encoding/json"
	"io/ioutil"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()

	err := wails.Run(&options.App{
		Title:  "TodoApp",
		Width:  800,
		Height: 600,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}

type App struct {
	tasks []Task
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.loadTasks()
}

func (a *App) AddTask(title string, dueDate string, priority int) Task {
	task := Task{
		ID:       len(a.tasks) + 1,
		Title:    title,
		DueDate:  dueDate,
		Priority: priority,
		Done:     false,
	}
	a.tasks = append(a.tasks, task)
	a.saveTasks()
	return task
}

func (a *App) GetTasks() []Task {
	return a.tasks
}

func (a *App) DeleteTask(id int) {
	for i, task := range a.tasks {
		if task.ID == id {
			a.tasks = append(a.tasks[:i], a.tasks[i+1:]...)
			break
		}
	}
	a.saveTasks()
}

func (a *App) ToggleTaskStatus(id int) Task {
	var updatedTask Task
	for i, task := range a.tasks {
		if task.ID == id {
			a.tasks[i].Done = !a.tasks[i].Done
			updatedTask = a.tasks[i]
			break
		}
	}
	a.saveTasks()
	return updatedTask
}

func (a *App) saveTasks() {
	data, err := json.Marshal(a.tasks)
	if err != nil {
		log.Println("Error marshalling tasks:", err)
		return
	}
	err = ioutil.WriteFile("tasks.json", data, 0644)
	if err != nil {
		log.Println("Error saving tasks:", err)
	}
}

func (a *App) loadTasks() {
	data, err := ioutil.ReadFile("tasks.json")
	if err != nil {
		log.Println("Error loading tasks:", err)
		return
	}
	err = json.Unmarshal(data, &a.tasks)
	if err != nil {
		log.Println("Error unmarshalling tasks:", err)
	}
}
