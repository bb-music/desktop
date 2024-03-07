package main

import (
	"context"
	"embed"
	"log"
	"os"
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
	// 日志输出
	svcLogger := NewSvcLogger()
	// 代理服务端口
	var proxyServerPort = 56599
	// 生产环境
	if !utils.IsDev() {
		proxyServerPort = 56592
		// 非开发环境日志使用文件存储
		log.SetOutput(&lumberjack.Logger{
			Filename:   filepath.Join(configDir, "logs/log.log"),
			MaxSize:    100,   // 在进行切割之前，日志文件的最大大小（以MB为单位）
			MaxBackups: 10,    // 保留旧文件的最大个数
			MaxAge:     30,    // 保留旧文件的最大天数
			Compress:   false, // 是否压缩/归档旧文件
		})
	}
	log.Println("开发环境:", utils.IsDev())
	log.Println("代理端口:", proxyServerPort)

	// 基础应用服务
	basic := app_base.New(configDir, proxyServerPort)
	// 音乐流代理服务
	musicProxyServer := bb_server.New(app_base.ProxyServer(proxyServerPort, configDir), log.Println)
	// 哔哩哔哩 音乐源服务
	bili := app_bili.New(configDir, svcLogger)

	// 客户端启动
	err := wails.Run(&options.App{
		Debug: options.Debug{
			OpenInspectorOnStartup: true,
		},
		Title:     "哔哔音乐",
		Frameless: true,
		// Width:  1064,
		// Height: 768,
		Width:  360,
		Height: 700,
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
			log.Println("启动音乐流代理服务")
			musicProxyServer.Run()
		},
		OnShutdown: func(ctx context.Context) {
			// bbsrv.Close()
			musicProxyServer.Close()
		},
		Bind: []interface{}{
			basic,
			bili,
		},
		Logger: NewWailsLogger(),
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

// 自用应用log服务
type SvcLogger struct{}

func NewSvcLogger() *SvcLogger {
	return &SvcLogger{}
}

func (l *SvcLogger) Info(message ...string) {
	log.Println("BiliSvc Info | ", message)
}
func (l *SvcLogger) Warn(message ...string) {
	log.Println("BiliSvc Warn | ", message)
}
func (l *SvcLogger) Error(message ...string) {
	log.Println("BiliSvc Err | ", message)
}

// wails log
type WailsLogger struct{}

func NewWailsLogger() *WailsLogger {
	return &WailsLogger{}
}

func (l *WailsLogger) Print(message string) {
	log.Println(message)
}

func (l *WailsLogger) Trace(message string) {
	log.Println("TRA | " + message)
}

func (l *WailsLogger) Debug(message string) {
	log.Println("DEB | " + message)
}

func (l *WailsLogger) Info(message string) {
	log.Println("INF | " + message)
}

func (l *WailsLogger) Warning(message string) {
	log.Println("WAR | " + message)
}

func (l *WailsLogger) Error(message string) {
	log.Println("ERR | " + message)
}

// Fatal level logging. Works like Sprintf.
func (l *WailsLogger) Fatal(message string) {
	log.Println("FAT | " + message)
	os.Exit(1)
}
