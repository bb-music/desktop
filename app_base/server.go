package app_base

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/bb-music/desktop/app_bili"
	"github.com/bb-music/desktop/pkg/bili_sdk"
)

func ProxyServer(port int, configDir string) *http.Server {
	mux := http.NewServeMux()

	s := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: mux,
	}
	// 视频代理服务 /music/file/:origin/:id
	mux.HandleFunc("/music/file/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		// 字符串分割
		arr := strings.Split(path, "/")

		origin := arr[3] // 源
		id := arr[4]     // 歌曲 ID

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
				log.Println("AppBase | 音乐流代理失败", fmt.Sprintf("origin=%+v;id=%+v", origin, id), fmt.Sprintf("err=%+v", err))
				w.Write([]byte(err.Error()))
			}
			proxy.ServeHTTP(w, req)
			return
		}
		w.Write([]byte(""))
	})

	return s
}
