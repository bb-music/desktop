package app

import (
	"bbmusic/pkg/bb_client"
	"context"
	"path/filepath"

	"github.com/duke-git/lancet/v2/fileutil"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	AppConfig
	ctx    context.Context
	client bb_client.Client
}

func NewApp() *App {
	configDir, _ := filepath.Abs("./config")
	if fileutil.IsExist(configDir) == false {
		fileutil.CreateDir(configDir)
	}
	return &App{
		AppConfig: AppConfig{
			ConfigDir: configDir,
		},
	}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	runtime.LogPrintf(ctx, "AppConfig %+v", a.AppConfig)
	// port, _ := GetFreePort()
	port := 56592
	a.VideoProxyPort = port
	// 启动一个代理服务
	ProxyServer(a, port)
}

// 客户端初始化，加载秘钥和 uuid
func (a *App) ClientInit() error {
	return a.client.Init()
}
