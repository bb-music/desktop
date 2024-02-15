package app

import (
	"bbmusic/pkg/bb_client"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func ProxyServer(port int) {
	// 视频代理服务
	http.HandleFunc("/videofile/", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		aid := query.Get("aid")
		bvid := query.Get("bvid")
		cid := query.Get("cid")

		uuid_v3 := query.Get("uuid_v3")
		uuid_v4 := query.Get("uuid_v4")
		img_key := query.Get("img_key")
		sub_key := query.Get("sub_key")

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
		fmt.Printf("client: %+v\n", client)
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
		fmt.Printf("resp: %+v\n", resp)
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

	http.ListenAndServe(fmt.Sprintf(":%+v", port), nil)
}
