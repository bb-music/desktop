package app_bili

import (
	"context"
	"os/user"
	"path/filepath"

	"github.com/OpenBBMusic/desktop/app_base"
	"github.com/OpenBBMusic/desktop/pkg/bb_client"

	osruntime "runtime"

	"github.com/wailsapp/wails/v2/pkg/runtime"
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
	runtime.LogPrintf(ctx, "AppConfig %+v", a.Config)
}

func GetConfigDir() (string, error) {
	var dir string
	if osruntime.GOOS == "windows" {
		r, err := filepath.Abs("./")
		if err != nil {
			return "", err
		}
		dir = r
	} else {
		userDir, _ := user.Current()
		r, err := filepath.Abs(userDir.HomeDir)
		if err != nil {
			return "", err
		}
		dir = r
	}
	configDir := filepath.Join(dir, ".bb_music")
	return configDir, nil
}
