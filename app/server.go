package app

import (
	"bbmusic/biliClient"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
	"time"
)

type FileLoader struct {
	http.Handler
	app *App
}

func NewFileLoader(app *App) *FileLoader {
	f := &FileLoader{}
	f.app = app
	return f
}

func (h *FileLoader) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("!!!!!!!!!!!!!!Request: %+v \n", r.URL.Path)
	if strings.Contains(r.URL.Path, "/videofile/") {
		query := r.URL.Query()
		aid := query.Get("aid")
		bvid := query.Get("bvid")
		cid := query.Get("cid")

		// 取出播放地址
		resp, _ := h.app.client.GetVideoUrl(biliClient.GetVideoUrlParams{
			GetVideoDetailParams: biliClient.GetVideoDetailParams{
				Aid:  aid,
				Bvid: bvid,
			},
			Cid: cid,
		})

		if len(resp.Durl) > 0 {
			// FLV / MP4 格式 直接代理请求
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
		}

	} else {
		requestedFilename := strings.TrimPrefix(r.URL.Path, "/")
		var err error
		fileData, err := os.ReadFile(requestedFilename)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(fmt.Sprintf("Could not load file %s", requestedFilename)))
		}

		w.Write(fileData)
	}

}

func NewMiddleware(app *App) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			fmt.Printf("!!!!!!!!!!!!!!Request: %+v \n", r.URL.Path)
			if strings.Contains(r.URL.Path, "/videofile/") {
				query := r.URL.Query()
				aid := query.Get("aid")
				bvid := query.Get("bvid")
				cid := query.Get("cid")

				go func() {
					// 取出播放地址
					resp, _ := app.client.GetVideoUrl(biliClient.GetVideoUrlParams{
						GetVideoDetailParams: biliClient.GetVideoDetailParams{
							Aid:  aid,
							Bvid: bvid,
						},
						Cid: cid,
					})

					if len(resp.Durl) > 0 {
						// FLV / MP4 格式 直接代理请求
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
					}
				}()
				time.Sleep(10 * time.Second)
				next.ServeHTTP(w, r)
			} else {
				next.ServeHTTP(w, r)
			}
		})
	}
}

func VideoProxyServer(app *App) {
	http.HandleFunc("/videofile/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("VideoProxyServer %+v \n", r.URL)
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

		if len(resp.Durl) > 0 {
			// FLV / MP4 格式 直接代理请求
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
			w.Write([]byte("Hello, World!"))
		}
	})

	http.ListenAndServe(":7840", nil)
}
