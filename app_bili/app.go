package app_bili

import (
	"github.com/OpenBBMusic/desktop/pkg/bili_sdk"
)

type App struct {
	config   *Config
	client   *bili_sdk.Client
	cacheDir string
}

func New(cacheDir string) *App {
	return &App{
		client:   bili_sdk.New(),
		config:   &Config{},
		cacheDir: cacheDir,
	}
}
