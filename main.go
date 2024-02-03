package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"

	"bbmusic/app"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	a := app.NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Debug: options.Debug{
			OpenInspectorOnStartup: true,
		},
		Title:  "哔哔音乐",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 251, G: 251, B: 251, A: 1},
		OnStartup:        a.Startup,
		Bind: []interface{}{
			a,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
