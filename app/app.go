package app

import (
	"bbmusic/pkg/bb_client"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type AppConfig struct {
	VideoProxyPort int                `json:"video_proxy_port"` // 视频代理服务端口号
	SignData       bb_client.SignData `json:"sign_data"`        // 签名
	DownloadDir    string             `json:"download_dir"`     // 下载保存目录
}

type App struct {
	AppConfig
	ctx    context.Context
	client bb_client.Client
}

func NewApp() *App {
	return &App{}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	a.client.New()
	// port, _ := GetFreePort()
	port := 56592
	a.VideoProxyPort = port
	// 启动一个代理服务
	ProxyServer(a, port)
}

/** 暴露给前端的配置 **/
func (a *App) GetConfig() AppConfig {
	return AppConfig{
		VideoProxyPort: a.VideoProxyPort,
		SignData:       a.client.SignData,
		DownloadDir:    a.DownloadDir,
	}
}

/** 更新下载的文件保存路径 **/
func (a *App) SetDownloadDir(path string) {
	a.DownloadDir = path
}

/** 更新下载的文件保存路径 **/
func (a *App) UpdateDownloadDir() (string, error) {
	dir, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "选择下载目录",
	})
	if err != nil {
		return "", err
	}
	a.DownloadDir = dir
	return dir, nil
}

/** 更新秘钥配置 **/
func (a *App) UpdateClientSignData(params bb_client.SignData) error {
	return a.client.UpdateSignData(params)
}

/** 加载秘钥配置 **/
func (a *App) LoadSignData() (bb_client.SignData, error) {
	return a.client.LoadSignData()
}

/** 获取秘钥配置 **/
func (a *App) GetSignData() bb_client.SignData {
	return a.client.SignData
}

/** 搜索视频 **/
func (a *App) Search(params bb_client.SearchParams) (bb_client.SearchResponse, error) {
	return a.client.Search(params)
}

/** 视频详情 **/
func (a *App) GetVideoDetail(params bb_client.GetVideoDetailParams) (bb_client.VideoDetailResponse, error) {
	return a.client.GetVideoDetail(params)
}

/** 获取视频地址 **/
func (a *App) GetVideoUrl(params bb_client.GetVideoUrlParams) (bb_client.VideoUrlResponse, error) {
	return a.client.GetVideoUrl(params)
}

type MusicOrderItem struct {
	ID     string      `json:"id"`
	Name   string      `json:"name"`
	Desc   string      `json:"desc"`
	Author string      `json:"author"`
	List   []MusicItem `json:"list"`
}

type MusicItem struct {
	AID      int    `json:"aid"`
	BVID     string `json:"bvid"`
	CID      int    `json:"cid"`
	Name     string `json:"name"`
	Duration int    `json:"duration"`
	ID       string `json:"id"`
}

/** 获取歌单源数据 **/
func (a *App) GetJsonOrigin(originUrl string) ([]MusicOrderItem, error) {
	resp, err := http.Get(originUrl)
	if err != nil {
		return []MusicOrderItem{}, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return []MusicOrderItem{}, err
	}
	if body, err := io.ReadAll(resp.Body); err != nil {
		return []MusicOrderItem{}, err
	} else {
		result := []MusicOrderItem{}
		if err := json.Unmarshal(body, &result); err != nil {
			return []MusicOrderItem{}, err

		}
		return result, nil
	}
}

type DownloadMusicParams struct {
	bb_client.GetVideoUrlParams
	Name string `json:"name"`
}

/** 下载 **/
func (a *App) DownloadMusic(params DownloadMusicParams) (string, error) {
	if a.DownloadDir == "" {
		return "", errors.New("请先选择下载目录")
	}
	resp, err := a.client.GetVideoUrl(params.GetVideoUrlParams)
	uuid := params.GetVideoUrlParams.Aid + "_" + params.GetVideoUrlParams.Bvid + "_" + params.GetVideoUrlParams.Cid

	if err != nil {
		return "", err
	}
	durlLen := len(resp.Durl)
	if durlLen > 0 {
		if durlLen == 1 {
			p := fmt.Sprintf("%+v/%+v_%+v.%+v", a.DownloadDir, params.Name, uuid, resp.Format)
			if e := DownloadUrl(p, resp.Durl[0].Url); e != nil {
				fmt.Printf("error%+v\n", e)
				return "", e
			}
		} else {
			for i := 0; i < durlLen; i++ {
				p := fmt.Sprintf("%+v/%+v_%+v/%+v.%+v", a.DownloadDir, params.Name, uuid, i+1, resp.Format)
				go DownloadUrl(p, resp.Durl[0].Url)
			}
		}
	}
	return "", nil
}

// 随机取一个未占用的端口
func GetFreePort() (int, error) {
	addr, err := net.ResolveTCPAddr("tcp", "127.0.0.1:0")
	if err != nil {
		return 0, err
	}
	cli, err := net.ListenTCP("tcp", addr)
	if err != nil {
		return 0, err
	}
	defer cli.Close()
	return cli.Addr().(*net.TCPAddr).Port, nil
}

func DownloadUrl(path string, url string) error {
	fmt.Print("path: ", path)
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

	_, errC := io.Copy(outputFile, resp.Body)
	if errC != nil {
		return errC
	}

	fmt.Println("下载成功")

	return nil
}
