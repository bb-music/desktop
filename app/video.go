package app

import (
	"bbmusic/pkg/bb_client"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

// 视频详情
func (a *App) GetVideoDetail(params bb_client.GetVideoDetailParams, auth AuthParams) (bb_client.VideoDetailResponse, error) {
	client := bb_client.Client{
		SignData: auth.SignData,
		SpiData:  auth.SpiData,
	}
	return client.GetVideoDetail(params)
}

// 获取视频地址
func (a *App) GetVideoUrl(params bb_client.GetVideoUrlParams, auth AuthParams) (bb_client.VideoUrlResponse, error) {
	client := bb_client.Client{
		SignData: auth.SignData,
		SpiData:  auth.SpiData,
	}
	return client.GetVideoUrl(params)
}

type MusicOrderItem struct {
	ID        string      `json:"id"`
	Name      string      `json:"name"`
	Cover     string      `json:"cover"`
	Desc      string      `json:"desc"`
	Author    string      `json:"author"`
	MusicList []MusicItem `json:"musicList"`
	CreatedAt string      `json:"created_at"`
	UpdatedAt string      `json:"updated_at"`
}

type MusicItem struct {
	AID       int                `json:"aid"`
	BVID      string             `json:"bvid"`
	CID       int                `json:"cid"`
	Name      string             `json:"name"`
	Duration  int                `json:"duration"`
	ID        string             `json:"id"`
	Origin    string             `json:"origin"`
	ExtraData MusicItemExtraData `json:"extraData"`
}
type MusicItemExtraData struct {
	Aid  int    `json:"aid"`
	Bvid string `json:"bvid"`
	Cid  int    `json:"cid"`
}

// 获取歌单源数据
func (a *App) GetJsonOrigin(originUrl string) ([]MusicOrderItem, error) {
	resp, err := http.Get(originUrl)
	if err != nil {
		return []MusicOrderItem{}, err
	}
	defer resp.Body.Close()
	// fmt.Println("===============================")
	// fmt.Printf("resp%v\n", resp)
	// fmt.Println("===============================")

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
		// fmt.Printf("resp%v\n", result)

		return result, nil
	}
}

type DownloadMusicParams struct {
	bb_client.GetVideoUrlParams
	Name        string `json:"name"`
	DownloadDir string `json:"download_dir"`
}

// 下载
func (a *App) DownloadMusic(params DownloadMusicParams, auth AuthParams) (string, error) {
	client := bb_client.Client{
		SignData: auth.SignData,
		SpiData:  auth.SpiData,
	}
	if params.DownloadDir == "" {
		return "", errors.New("请先选择下载目录")
	}
	resp, err := client.GetVideoUrl(params.GetVideoUrlParams)
	uuid := params.GetVideoUrlParams.Aid + "_" + params.GetVideoUrlParams.Bvid + "_" + params.GetVideoUrlParams.Cid

	if err != nil {
		return "", err
	}
	durlLen := len(resp.Durl)
	if durlLen > 0 {
		if durlLen == 1 {
			p := fmt.Sprintf("%+v/%+v_%+v.%+v", params.DownloadDir, params.Name, uuid, resp.Format)
			if e := DownloadUrl(p, resp.Durl[0].Url); e != nil {
				fmt.Printf("error%+v\n", e)
				return "", e
			}
		} else {
			for i := 0; i < durlLen; i++ {
				p := fmt.Sprintf("%+v/%+v_%+v/%+v.%+v", params.DownloadDir, params.Name, uuid, i+1, resp.Format)
				go DownloadUrl(p, resp.Durl[0].Url)
			}
		}
	}
	return "", nil
}
