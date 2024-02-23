package app_bili

import (
	"bbmusic/pkg/bb_client"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
)

type AuthInfo struct {
	UuidV3 string
	UuidV4 string
	ImgKey string
	SubKey string
}

var auth = AuthInfo{}

func ProxyServer(port int) {
	// 视频代理服务
	http.HandleFunc("/video/proxy/", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		aid := query.Get("aid")
		bvid := query.Get("bvid")
		cid := query.Get("cid")

		// uuid_v3 := query.Get("uuid_v3")
		// uuid_v4 := query.Get("uuid_v4")
		// img_key := query.Get("img_key")
		// sub_key := query.Get("sub_key")
		uuid_v3 := auth.UuidV3
		uuid_v4 := auth.UuidV4
		img_key := auth.ImgKey
		sub_key := auth.SubKey
		fmt.Printf("Auth: %+v\n", auth)

		client := bb_client.Client{
			SpiData: bb_client.SpiData{
				UUID_V3: uuid_v3,
				UUID_V4: uuid_v4,
			},
			SignData: bb_client.SignData{
				ImgKey: img_key,
				SubKey: sub_key,
			},
		}
		// fmt.Printf("client: %+v\n", client)
		// 取出播放地址
		resp, err := client.GetVideoUrl(bb_client.GetVideoUrlParams{
			GetVideoDetailParams: bb_client.GetVideoDetailParams{
				Aid:  aid,
				Bvid: bvid,
			},
			Cid: cid,
		})
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
				r.Header.Set("User-Agent", bb_client.UserAgent)
			}
			proxy.ModifyResponse = func(resp *http.Response) error {
				return nil
			}

			req, _ := http.NewRequest("GET", resp.Durl[0].Url, nil)

			proxy.ServeHTTP(w, req)
		} else {
			w.Write([]byte(resp.Result))
		}
	})

	// 设置验证信息
	http.HandleFunc("/setauth", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		query := r.URL.Query()

		uuid_v3 := query.Get("uuid_v3")
		uuid_v4 := query.Get("uuid_v4")
		img_key := query.Get("img_key")
		sub_key := query.Get("sub_key")

		auth.UuidV3 = uuid_v3
		auth.UuidV4 = uuid_v4
		auth.ImgKey = img_key
		auth.SubKey = sub_key

		w.Write([]byte("success"))
	})

	http.ListenAndServe(fmt.Sprintf(":%+v", port), nil)
}
