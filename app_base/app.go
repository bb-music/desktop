// 应用基础服务
package app_base

import (
	"context"
	"fmt"
	"net"

	"github.com/OpenBBMusic/desktop/pkg/file_storage"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Config struct {
	ProxyServerPort int    `json:"proxy_server_port"` // 代理服务端口号
	ConfigDir       string `json:"config_dir"`        // 配置文件目录
}

type App struct {
	Config      *Config
	FileStorage *file_storage.FileStorage
	ctx         context.Context
}

func New(configDir string) *App {
	fmt.Println("================ AppBase 启动 ==============")
	fileStorage := file_storage.New(configDir)
	port := 56592
	return &App{
		Config: &Config{
			ConfigDir:       configDir,
			ProxyServerPort: port,
		},
		FileStorage: fileStorage,
	}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	// 启动一个代理服务
	ProxyServer(a.Config.ProxyServerPort, a.FileStorage)
}

// 打开文件夹选择器
func (a *App) OpenDirectoryDialog(title string) (string, error) {
	return runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: title,
	})
}

// 获取配置信息
func (a *App) GetConfig() (Config, error) {
	return *a.Config, nil
}

// 获取播放地址
func (a *App) GetMusicPlayerUrl(id string, origin string) (string, error) {
	path := "/video/proxy/" + origin + "/" + id
	port := a.Config.ProxyServerPort
	return fmt.Sprintf("http://localhost:%+v%+v", port, path), nil
}

// 随机取一个未占用的端口
func GetFreePort() (int, error) {
	addr, err := net.ResolveTCPAddr("tcp", "127.0.0.1:0")
	if err != nil {
		return 0, err
	}
	cli, err := net.ListenTCP("tcp", addr)
	if err != nil {
		return 0, err
	}
	defer cli.Close()
	return cli.Addr().(*net.TCPAddr).Port, nil
}
