package app_base

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/OpenBBMusic/desktop/app_bili"
	"github.com/OpenBBMusic/desktop/pkg/bili_sdk"
	"github.com/OpenBBMusic/desktop/pkg/file_storage"
)

type AuthInfo struct {
	UuidV3 string
	UuidV4 string
	ImgKey string
	SubKey string
}

var auth = AuthInfo{}

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
				w.Write([]byte(""))
			}
			proxy.ServeHTTP(w, req)
			return
		}
		w.Write([]byte(""))
	})

	// s.ListenAndServe()
	return s
}

type CacheConfig struct {
	SignData bili_sdk.SignData `json:"sign_data"`
	SpiData  bili_sdk.SpiData  `json:"spi_data"`
}

func GetBiliCacheConfig(fileStorage *file_storage.FileStorage) *CacheConfig {
	// 读缓存
	cacheConfigStr, _ := fileStorage.GetStorage(app_bili.ConfigCacheKey)
	cacheConfig := &CacheConfig{}
	// 序列化为 json
	if err := json.Unmarshal([]byte(cacheConfigStr), cacheConfig); err != nil {
		log.Printf("bili 缓存配置不存在 | %+v\n", err)
	}

	return cacheConfig
}
