package app_bili

import (
	"bbmusic/pkg/bb_client"
	"context"
	"os/user"
	"path/filepath"

	osruntime "runtime"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Config struct {
	ProxyServerPort int                `json:"proxy_server_port"`
	SignData        bb_client.SignData `json:"sign_data"`
	SpiData         bb_client.SpiData  `json:"spi_data"`
}

type App struct {
	Config
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	runtime.LogPrintf(ctx, "AppConfig %+v", a.Config)
	// port, _ := GetFreePort()
	port := 56592
	a.ProxyServerPort = port
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
