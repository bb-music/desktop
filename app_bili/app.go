package app_bili

import (
	"context"

	"github.com/OpenBBMusic/desktop/app_base"
	"github.com/OpenBBMusic/desktop/pkg/bb_client"
	"github.com/labstack/gommon/log"
)

type App struct {
	Config  *Config `json:"config"`
	client  *bb_client.Client
	ctx     context.Context
	appBase *app_base.App
}

func New(appBase *app_base.App) *App {
	return &App{
		client:  bb_client.New(),
		appBase: appBase,
		Config:  &Config{},
	}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	log.Printf("AppConfig %+v", a.Config)
}
