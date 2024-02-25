package app_bili

import (
	"github.com/OpenBBMusic/desktop/pkg/bb_client"
	"github.com/OpenBBMusic/desktop/pkg/file_storage"
)

type App struct {
	config       *Config
	client       *bb_client.Client
	cacheStorage *file_storage.FileStorage
}

func New(cacheDir string) *App {
	return &App{
		client:       bb_client.New(),
		cacheStorage: file_storage.New(cacheDir),
		config:       &Config{},
	}
}
