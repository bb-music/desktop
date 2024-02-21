package app

import (
	"bbmusic/pkg/bb_client"
	"context"
	"fmt"
	"os/user"
	"path/filepath"

	osruntime "runtime"

	"github.com/duke-git/lancet/v2/fileutil"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	AppConfig
	ctx context.Context
}

func NewApp() *App {
	fmt.Println("================ APP START ==============")
	configDir, _ := GetConfigDir()
	fmt.Println("configDir", configDir)

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
