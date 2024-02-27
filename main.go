package main

import (
	"context"
	"embed"
	"log"
	"path/filepath"

	"github.com/duke-git/lancet/v2/fileutil"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"gopkg.in/natefinch/lumberjack.v2"

	"github.com/bb-music/desktop/app_base"
	"github.com/bb-music/desktop/app_bili"
	"github.com/bb-music/desktop/pkg/bb_server"
	"github.com/bb-music/desktop/pkg/logger"
	"github.com/bb-music/desktop/utils"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// 配置文件目录
	configDir, _ := utils.GetConfigDir()
	if !fileutil.IsExist(configDir) {
		fileutil.CreateDir(configDir)
	}

	if !utils.IsDev() {
		// 非开发环境日志使用文件存储
		log.SetOutput(&lumberjack.Logger{
			Filename:   filepath.Join(configDir, "logs/log.log"),
			MaxSize:    100,   // 在进行切割之前，日志文件的最大大小（以MB为单位）
			MaxBackups: 10,    // 保留旧文件的最大个数
			MaxAge:     30,    // 保留旧文件的最大天数
			Compress:   false, // 是否压缩/归档旧文件
		})
	}

	basic := app_base.New(configDir)

	musicProxyServer := bb_server.New(app_base.ProxyServer(basic.Config.ProxyServerPort, configDir), log.Println)
	go func() {
		log.Println("启动音乐流代理服务")
		musicProxyServer.Run()
	}()

	bili := app_bili.New(configDir)

	err := wails.Run(&options.App{
		Debug: options.Debug{
			OpenInspectorOnStartup: true,
		},
		Title:     "哔哔音乐",
		Width:     1064,
		Height:    768,
		Frameless: true,
		Windows: &windows.Options{
			WebviewIsTransparent: true,
		},
		Mac: &mac.Options{
			WebviewIsTransparent: true,
		},
		AssetServer: &assetserver.Options{
			Assets: assets,
			// Handler: app_base.NewFileLoader(configDir),
			// Middleware: app_base.NewMiddleware(configDir),
		},
		BackgroundColour: &options.RGBA{R: 251, G: 251, B: 251, A: 1},
		OnStartup: func(ctx context.Context) {
			basic.Startup(ctx)
		},
		OnShutdown: func(ctx context.Context) {
			// bbsrv.Close()
			musicProxyServer.Close()
		},
		Bind: []interface{}{
			basic,
			bili,
		},
		Logger: logger.New(),
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
