// 简单实现一个基于文件的存储，给前端用
package app

import (
	"path/filepath"

	"github.com/duke-git/lancet/v2/fileutil"
)

const storageName = "cache_storage"

// 读
func (a *App) GetStorage(key string) (string, error) {
	dir := a.AppConfig.ConfigDir
	p := filepath.Join(dir, storageName, key+".json")

	if fileutil.IsExist(p) == false {
		return "", nil
	}

	return fileutil.ReadFileToString(p)
}

// 写
func (a *App) SetStorage(key string, value string) error {
	dir := a.AppConfig.ConfigDir
	p := filepath.Join(dir, storageName, key+".json")

	return fileutil.WriteStringToFile(p, value, false)
}

// 删除
func (a *App) RemoveStorage(key string) error {
	dir := a.AppConfig.ConfigDir
	p := filepath.Join(dir, storageName, key+".json")
	return fileutil.RemoveFile(p)
}
