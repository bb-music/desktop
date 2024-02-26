// 此方案目前存在缺陷，无法流式加载
package app_base

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"

	"github.com/OpenBBMusic/desktop/pkg/bili_sdk"
)

type FileLoader struct {
	http.Handler
}

func NewFileLoader() *FileLoader {
	return &FileLoader{}
}

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	fmt.Println("Path: ", req.URL.Path)

	// 视频资源代理服务
	if strings.HasPrefix(req.URL.Path, "/video/proxy") {
		videoProxyServer(res, req)
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

func videoProxyServer(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	aid := query.Get("aid")
	bvid := query.Get("bvid")
	cid := query.Get("cid")

	uuid_v3 := query.Get("uuid_v3")
	uuid_v4 := query.Get("uuid_v4")
	img_key := query.Get("img_key")
	sub_key := query.Get("sub_key")
	// uuid_v3 := auth.UuidV3
	// uuid_v4 := auth.UuidV4
	// img_key := auth.ImgKey
	// sub_key := auth.SubKey
	fmt.Printf("Auth: %+v\n", auth)

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
}
