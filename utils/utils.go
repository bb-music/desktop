package utils

import (
	"os"
	"os/user"
	"path/filepath"
	"runtime"
)

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

// 是否为开发环境
func IsDev() bool {
	args := os.Args
	for i := 0; i < len(args); i++ {
		if args[i] == "--development" {
			return true
		}
	}
	return false
}
