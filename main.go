package main

import (
	"context"
	"embed"
	"log"
	"os"
	"os/user"
	"path/filepath"
	"runtime"

	"github.com/duke-git/lancet/v2/fileutil"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"gopkg.in/natefinch/lumberjack.v2"

	"github.com/OpenBBMusic/desktop/app_base"
	"github.com/OpenBBMusic/desktop/app_bili"
	"github.com/OpenBBMusic/desktop/pkg/logger"
	"github.com/OpenBBMusic/desktop/server"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// 配置文件目录
	configDir, _ := GetConfigDir()
	if !fileutil.IsExist(configDir) {
		fileutil.CreateDir(configDir)
	}

	if !IsDev() {
		// 非开发环境日志使用文件存储
		log.SetOutput(&lumberjack.Logger{
			Filename:   filepath.Join(configDir, "logs/log.log"),
			MaxSize:    100,   // 在进行切割之前，日志文件的最大大小（以MB为单位）
			MaxBackups: 10,    // 保留旧文件的最大个数
			MaxAge:     30,    // 保留旧文件的最大天数
			Compress:   false, // 是否压缩/归档旧文件
		})
	}

	app_base := app_base.New(configDir)

	bbsrv := server.New(9091, configDir)
	go bbsrv.Run()

	app_bili := app_bili.New(configDir)

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
			// Handler: app.NewFileLoader(),
			// Middleware: app.NewMiddleware(a),
		},
		BackgroundColour: &options.RGBA{R: 251, G: 251, B: 251, A: 1},
		OnStartup: func(ctx context.Context) {
			app_base.Startup(ctx)
		},
		OnShutdown: func(ctx context.Context) {
			bbsrv.Close()
		},
		Bind: []interface{}{
			app_base,
			app_bili,
		},
		Logger: logger.New(),
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

// 获取配置目录
func GetConfigDir() (string, error) {
	var dir string
	if runtime.GOOS == "windows" {
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

func IsDev() bool {
	args := os.Args
	for i := 0; i < len(args); i++ {
		if args[i] == "--development" {
			return true
		}
	}
	return false
}
