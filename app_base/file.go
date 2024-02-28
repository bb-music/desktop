// 简单实现一个基于文件的存储，给前端用
package app_base

import (
	"fmt"
	"log"
)

const storageName = "cache_storage"

func createFileKey(key string) string {
	return storageName + "/" + key + ".json"
}

// 读
func (a *App) GetStorage(key string) (string, error) {
	d, err := a.FileStorage.GetStorage(createFileKey(key))
	if err != nil {
		log.Println("AppBase | 文件读取失败", fmt.Sprintf("key=%+v", key), fmt.Sprintf("err=%+v", err))
		return "", err
	}
	return d, nil
}

// 写
func (a *App) SetStorage(key string, value string) error {
	err := a.FileStorage.SetStorage(createFileKey(key), value)
	if err != nil {
		log.Println("AppBase | 文件写入失败", fmt.Sprintf("key=%+v", key), fmt.Sprintf("err=%+v", err))
		return err
	}
	return nil
}

// 删除
func (a *App) RemoveStorage(key string) error {
	err := a.FileStorage.RemoveStorage(createFileKey(key))
	if err != nil {
		log.Println("AppBase | 文件删除失败", fmt.Sprintf("key=%+v", key), fmt.Sprintf("err=%+v", err))
		return err
	}
	return nil
}
