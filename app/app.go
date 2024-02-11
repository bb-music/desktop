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
	ctx context.Context
}

func NewApp() *App {
	configDir, _ := filepath.Abs("./config")
	if !fileutil.IsExist(configDir) {
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
	ProxyServer(port)
}

// 请求时需要的认证数据
type AuthParams struct {
	SignData bb_client.SignData `json:"sign_data"` // 签名
	SpiData  bb_client.SpiData  `json:"spi_data"`  // 风控数据
}
