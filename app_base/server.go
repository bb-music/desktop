package app_base

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/OpenBBMusic/desktop/pkg/bili_sdk"
	"github.com/OpenBBMusic/desktop/pkg/file_storage"
)

type AuthInfo struct {
	UuidV3 string
	UuidV4 string
	ImgKey string
	SubKey string
}

var ConfigCacheKey = "bili-config.json"

var auth = AuthInfo{}

func ProxyServer(port int, fileStorage *file_storage.FileStorage) {
	// 视频代理服务
	http.HandleFunc("/video/proxy/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		// 字符串分割
		arr := strings.Split(path, "/")

		origin := arr[3] // 源
		id := arr[4]     // 歌曲 ID

		if origin == "bili" {
			q := strings.Split(id, "_")
			aid := q[0]
			bvid := q[1]
			cid := q[2]
			log.Println(aid, bvid, cid)

			cacheConfig := GetBiliCacheConfig(fileStorage)

			uuid_v3 := cacheConfig.SpiData.UUID_V3
			uuid_v4 := cacheConfig.SpiData.UUID_V4
			img_key := cacheConfig.SignData.ImgKey
			sub_key := cacheConfig.SignData.SubKey

			client := bili_sdk.Client{
				SpiData: bili_sdk.SpiData{
					UUID_V3: uuid_v3,
					UUID_V4: uuid_v4,
				},
				SignData: bili_sdk.SignData{
					ImgKey: img_key,
					SubKey: sub_key,
				},
			}
			// fmt.Printf("client: %+v\n", client)
			// 取出播放地址
			resp, err := client.GetVideoUrl(aid, bvid, cid)
			if err != nil {
				fmt.Printf("err: %+v\n", err)
			}
			// fmt.Printf("resp: %+v\n", resp)
			// FLV / MP4 格式 直接代理请求
			if len(resp.Durl) > 0 {
				originURL := resp.Durl[0].Url
				u, _ := url.Parse(originURL)

				proxy := httputil.NewSingleHostReverseProxy(u)
				proxy.Director = func(r *http.Request) {
					r.Header.Set("Referer", "https://www.bilibili.com/")
					r.Header.Set("Cookie", "")
					r.Header.Set("User-Agent", bili_sdk.UserAgent)
				}
				proxy.ModifyResponse = func(resp *http.Response) error {
					return nil
				}

				req, _ := http.NewRequest("GET", resp.Durl[0].Url, nil)

				proxy.ServeHTTP(w, req)
			} else {
				w.Write([]byte(resp.Result))
			}
			return
		}
		w.Write([]byte(""))
	})

	http.ListenAndServe(fmt.Sprintf(":%+v", port), nil)
}

type CacheConfig struct {
	SignData bili_sdk.SignData `json:"sign_data"`
	SpiData  bili_sdk.SpiData  `json:"spi_data"`
}

func GetBiliCacheConfig(fileStorage *file_storage.FileStorage) *CacheConfig {
	// 读缓存
	cacheConfigStr, _ := fileStorage.GetStorage(ConfigCacheKey)
	cacheConfig := &CacheConfig{}
	// 序列化为 json
	if err := json.Unmarshal([]byte(cacheConfigStr), cacheConfig); err != nil {
		log.Printf("bili 缓存配置不存在 | %+v\n", err)
	}

	return cacheConfig
}
