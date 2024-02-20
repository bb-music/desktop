package app

import (
	"bbmusic/pkg/bb_client"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type AppConfig struct {
	VideoProxyPort int    `json:"video_proxy_port"` // 视频代理服务端口号
	ConfigDir      string `json:"config_dir"`       // 配置文件目录
}

// 暴露给前端的配置
func (a *App) GetConfig() AppConfig {
	return AppConfig{
		VideoProxyPort: a.VideoProxyPort,
		ConfigDir:      a.ConfigDir,
	}
}

// 获取秘钥配置
func (a *App) GetSignData() (bb_client.SignData, error) {
	client := bb_client.New()
	return client.GetSignData()
}

// 获取 Spi 配置
func (a *App) GetSpiData() (bb_client.SpiData, error) {
	client := bb_client.New()
	return client.GetSpiData()
}

// 打开文件夹选择器
func (a *App) OpenDirectoryDialog(title string) (string, error) {
	return runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: title,
	})
}
