// 此方案目前存在缺陷，无法流式加载
package app_base

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/OpenBBMusic/desktop/app_bili"
	"github.com/OpenBBMusic/desktop/pkg/bili_sdk"
)

type FileLoader struct {
	http.Handler
	configDir string
}

func NewFileLoader(configDir string) *FileLoader {
	return &FileLoader{
		configDir: configDir,
	}
}

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	// 视频资源代理服务
	if strings.HasPrefix(req.URL.Path, "/music/file") {
		musicProxyServer(h.configDir, res, req)
	} else {
		var err error
		path := strings.TrimPrefix(req.URL.Path, "/")
		fileData, err := os.ReadFile(path)
		if err != nil {
			res.WriteHeader(http.StatusBadRequest)
			res.Write([]byte(fmt.Sprintf("Could not load file %s", path)))
		}

		res.Write(fileData)
	}
}

// /music/file/:origin/:id.music
func musicProxyServer(configDir string, w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	// 字符串分割
	arr := strings.Split(path, "/")

	origin := arr[3]                    // 源
	id := strings.Split(arr[4], ".")[0] // 歌曲 ID

	// fmt.Println("============== 音乐流转发 ===============")
	// fmt.Println("Origin: ", origin)
	// fmt.Println("ID: ", id)

	if origin == "bili" {
		biliConfigStorage := app_bili.NewConfigStorage(configDir)
		cacheConfig := biliConfigStorage.Get()

		client := bili_sdk.Client{
			SpiData: bili_sdk.SpiData{
				UUID_V3: cacheConfig.SpiData.UUID_V3,
				UUID_V4: cacheConfig.SpiData.UUID_V4,
			},
			SignData: bili_sdk.SignData{
				ImgKey: cacheConfig.SignData.ImgKey,
				SubKey: cacheConfig.SignData.SubKey,
			},
		}
		proxy, req, err := app_bili.ProxyMusicFile(id, &client)
		if err != nil {
			w.Write([]byte(""))
		}
		proxy.ServeHTTP(w, req)
		return
	}
	r.Response.Status = "500"
	w.Write([]byte(""))
}

func NewMiddleware(configDir string) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// 文件请求
			if strings.HasPrefix(r.URL.Path, "/music/file") {
				musicProxyServer(configDir, w, r)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
