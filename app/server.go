package app

import (
	"bbmusic/biliClient"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
)

// 视频代理服务
func VideoProxyServer(app *App, port int) {
	http.HandleFunc("/videofile/", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		aid := query.Get("aid")
		bvid := query.Get("bvid")
		cid := query.Get("cid")

		// 取出播放地址
		resp, _ := app.client.GetVideoUrl(biliClient.GetVideoUrlParams{
			GetVideoDetailParams: biliClient.GetVideoDetailParams{
				Aid:  aid,
				Bvid: bvid,
			},
			Cid: cid,
		})

		// FLV / MP4 格式 直接代理请求
		if len(resp.Durl) > 0 {
			originURL := resp.Durl[0].Url
			u, _ := url.Parse(originURL)

			proxy := httputil.NewSingleHostReverseProxy(u)
			proxy.Director = func(r *http.Request) {
				r.Header.Set("Referer", "https://www.bilibili.com/")
				r.Header.Set("Cookie", "")
				r.Header.Set("User-Agent", biliClient.UserAgent)
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
