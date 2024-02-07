package app

import (
	"bbmusic/pkg/bb_client"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type AppConfig struct {
	VideoProxyPort int                `json:"video_proxy_port"` // 视频代理服务端口号
	SignData       bb_client.SignData `json:"sign_data"`        // 签名
	DownloadDir    string             `json:"download_dir"`     // 下载保存目录
	ConfigDir      string             `json:"config_dir"`       // 配置文件目录
}

/** 暴露给前端的配置 **/
func (a *App) GetConfig() AppConfig {
	return AppConfig{
		VideoProxyPort: a.VideoProxyPort,
		SignData:       a.client.SignData,
		DownloadDir:    a.DownloadDir,
		ConfigDir:      a.ConfigDir,
	}
}

/** 更新下载的文件保存路径 **/
func (a *App) SetDownloadDir(path string) {
	a.DownloadDir = path
}

/** 更新下载的文件保存路径 **/
func (a *App) UpdateDownloadDir() (string, error) {
	dir, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "选择下载目录",
	})
	if err != nil {
		return "", err
	}
	a.DownloadDir = dir
	return dir, nil
}

/** 更新秘钥配置 **/
func (a *App) UpdateClientSignData(params bb_client.SignData) error {
	return a.client.UpdateSignData(params)
}

/** 加载秘钥配置 **/
func (a *App) LoadSignData() (bb_client.SignData, error) {
	return a.client.LoadSignData()
}

/** 获取秘钥配置 **/
func (a *App) GetSignData() bb_client.SignData {
	return a.client.SignData
}
