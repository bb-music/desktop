package app_bili

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/OpenBBMusic/desktop/pkg/bb_client"
)

// 获取播放地址
func (a *App) GetMusicPlayerUrl(id string, origin string) (string, error) {
	path := "/video/proxy/" + origin + "/" + id
	port := a.appBase.Config.ProxyServerPort
	return fmt.Sprintf("http://localhost:%+v%+v", port, path), nil
}

// 下载
func (a *App) DownloadMusic(params DownloadMusicParams) (string, error) {
	if params.DownloadDir == "" {
		return "", errors.New("请先选择下载目录")
	}
	biliid, err := UnicodeBiliId(params.ID)
	if err != nil {
		return "", err
	}
	resp, err := a.client.GetVideoUrl(biliid.Aid, biliid.Bvid, biliid.Cid)

	if err := DownloadBiliMusic(params.ID, params.Name, params.DownloadDir, resp); err != nil {
		return "", err
	}

	return "", nil
}

func DownloadBiliMusic(id string, fileName string, downloadDir string, resp bb_client.VideoUrlResponse) error {
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
	req.Header.Set("User-Agent", bb_client.UserAgent)

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
