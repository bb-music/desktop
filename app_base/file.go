// 简单实现一个基于文件的存储，给前端用
package app_base

const storageName = "cache_storage"

func createFileKey(key string) string {
	return storageName + "/" + key + ".json"
}

// 读
func (a *App) GetStorage(key string) (string, error) {
	return a.FileStorage.GetStorage(createFileKey(key))
}

// 写
func (a *App) SetStorage(key string, value string) error {
	return a.FileStorage.SetStorage(createFileKey(key), value)
}

// 删除
func (a *App) RemoveStorage(key string) error {
	return a.FileStorage.RemoveStorage(createFileKey(key))
}
