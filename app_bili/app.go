package app_bili

import (
	"github.com/bb-music/desktop/pkg/bb_logger"
	"github.com/bb-music/desktop/pkg/bili_sdk"
)

type App struct {
	config   *Config
	client   *bili_sdk.Client
	cacheDir string
	logger   bb_logger.Logger
}

func New(cacheDir string, logger bb_logger.Logger) *App {
	return &App{
		client:   bili_sdk.New(),
		config:   &Config{},
		cacheDir: cacheDir,
		logger:   logger,
	}
}
