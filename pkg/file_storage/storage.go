// 基于一个文件目录作为文件 key/value 读写
package file_storage

import (
	"path/filepath"

	"github.com/duke-git/lancet/v2/fileutil"
)

type FileStorage struct {
	Dir string `json:"dir"` // 文件目录
}

func New(dir string) *FileStorage {
	// 判断目录是否存在
	if !fileutil.IsExist(dir) {
		fileutil.CreateDir(dir)
	}
	return &FileStorage{
		Dir: dir,
	}
}

// 读
func (a *FileStorage) GetStorage(key string) (string, error) {
	dir := a.Dir
	p := filepath.Join(dir, key)

	if !fileutil.IsExist(p) {
		return "", nil
	}

	return fileutil.ReadFileToString(p)
}

// 写
func (a *FileStorage) SetStorage(key string, value string) error {
	dir := a.Dir
	p := filepath.Join(dir, key)

	if !fileutil.IsExist(p) {
		parentPath := filepath.Dir(p)
		if !fileutil.IsExist(parentPath) {
			fileutil.CreateDir(parentPath)
		}
		fileutil.CreateFile(p)
	}
	return fileutil.WriteStringToFile(p, value, false)
}

// 删除
func (a *FileStorage) RemoveStorage(key string) error {
	dir := a.Dir
	p := filepath.Join(dir, key)
	if !fileutil.IsExist(p) {
		return nil
	}
	return fileutil.RemoveFile(p)
}
