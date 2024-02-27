package app_bili

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/bb-music/desktop/pkg/bb_type"
	"github.com/bb-music/desktop/pkg/bili_sdk"
)

// 获取歌曲文件
func (a *App) GetMusicFile(id string) (*httputil.ReverseProxy, *http.Request, error) {
	return ProxyMusicFile(id, a.client)
}

// 下载
func (a *App) DownloadMusic(params bb_type.DownloadMusicParams) (string, error) {
	if params.DownloadDir == "" {
		return "", errors.New("请先选择下载目录")
	}
	biliid, err := UnicodeBiliId(params.ID)
	if err != nil {
		return "", err
	}
	resp, err := a.client.GetVideoUrl(biliid.Aid, biliid.Bvid, biliid.Cid)
	if err != nil {
		return "", errors.New("sdk 获取歌曲播放地址失败")
	}
	if err := DownloadBiliMusic(params.ID, params.Name, params.DownloadDir, resp); err != nil {
		return "", err
	}

	return "", nil
}

func DownloadBiliMusic(id string, fileName string, downloadDir string, resp bili_sdk.VideoUrlResponse) error {
	durlLen := len(resp.Durl)
	if durlLen > 0 {
		if durlLen == 1 {
			p := fmt.Sprintf("%+v/%+v_%+v.%+v", downloadDir, fileName, id, resp.Format)
			if e := DownloadUrl(p, resp.Durl[0].Url); e != nil {
				fmt.Printf("error%+v\n", e)
				return e
			}
		} else {
			for i := 0; i < durlLen; i++ {
				p := fmt.Sprintf("%+v/%+v_%+v/%+v.%+v", downloadDir, fileName, id, i+1, resp.Format)
				go DownloadUrl(p, resp.Durl[0].Url)
			}
		}
	}
	return nil
}

func DownloadUrl(path string, url string) error {
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Referer", "https://www.bilibili.com/")
	req.Header.Set("Cookie", "")
	req.Header.Set("User-Agent", bili_sdk.UserAgent)

	resp, errA := http.DefaultClient.Do(req)
	if errA != nil {
		return errA
	}
	defer resp.Body.Close()

	outputFile, errB := os.Create(path)
	if errB != nil {
		return errB
	}
	defer outputFile.Close()

	if _, err := io.Copy(outputFile, resp.Body); err != nil {
		return err
	}

	return nil
}

// 使用代理的方式获取歌曲的播放流
func ProxyMusicFile(id string, client *bili_sdk.Client) (*httputil.ReverseProxy, *http.Request, error) {
	biliid, err := UnicodeBiliId(id)
	if err != nil {
		return nil, nil, err
	}

	resp, err := client.GetVideoUrl(biliid.Aid, biliid.Bvid, biliid.Cid)
	if err != nil {
		return nil, nil, errors.New("sdk 获取歌曲播放地址失败")
	}
	if len(resp.Durl) > 0 {
		originURL := resp.Durl[0].Url
		u, _ := url.Parse(originURL)

		proxy := httputil.NewSingleHostReverseProxy(u)

		proxy.Director = func(r *http.Request) {
			// 设置必须得请求头
			r.Header.Set("Referer", "https://www.bilibili.com/")
			r.Header.Set("Cookie", "")
			r.Header.Set("User-Agent", bili_sdk.UserAgent)
		}

		req, _ := http.NewRequest("GET", resp.Durl[0].Url, nil)

		return proxy, req, nil
	}
	return nil, nil, fmt.Errorf("Durl")
}
