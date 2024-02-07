// 简单实现一个基于文件的存储，给前端用
package app

import (
	"os"
	"path/filepath"
)

const storageName = "cache_storage"

// 读
func (a *App) GetStorage(key string) (string, error) {
	dir := a.AppConfig.ConfigDir
	p := filepath.Join(dir, storageName, key+".json")
	res, err := os.ReadFile(p)
	if err != nil {
		return "", err
	}
	return string(res), nil
}

// 写
func (a *App) SetStorage(key string, value string) error {
	dir := a.AppConfig.ConfigDir
	p := filepath.Join(dir, storageName, key+".json")
	err := os.WriteFile(p, []byte(value), 0644)
	if err != nil {
		return err
	}
	return nil
}

// 删除
func (a *App) RemoveStorage(key string) error {
	dir := a.AppConfig.ConfigDir
	p := filepath.Join(dir, storageName, key+".json")
	err := os.Remove(p)
	if err != nil {
		return err
	}
	return nil
}
