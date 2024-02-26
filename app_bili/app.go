package app_bili

import (
	"github.com/OpenBBMusic/desktop/pkg/bili_sdk"
	"github.com/OpenBBMusic/desktop/pkg/file_storage"
)

type App struct {
	config       *Config
	client       *bili_sdk.Client
	cacheStorage *file_storage.FileStorage
}

func New(cacheDir string) *App {
	return &App{
		client:       bili_sdk.New(),
		cacheStorage: file_storage.New(cacheDir),
		config:       &Config{},
	}
}
