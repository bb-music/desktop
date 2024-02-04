package app

import (
	"bbmusic/biliClient"
	"context"
)

// App struct
type App struct {
	ctx    context.Context
	client biliClient.Client
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	a.client.New()

	VideoProxyServer(a)
}

/** 更新秘钥配置 **/
func (a *App) UpdateClientSignData(params biliClient.SignData) error {
	return a.client.UpdateSignData(params)
}

/** 加载秘钥配置 **/
func (a *App) LoadSignData() (biliClient.SignData, error) {
	return a.client.LoadSignData()
}

/** 获取秘钥配置 **/
func (a *App) GetSignData() biliClient.SignData {
	return a.client.GetSignData()
}

/** 搜索视频 **/
func (a *App) Search(params biliClient.SearchParams) (biliClient.SearchResponse, error) {
	return a.client.Search(params)
}

/** 视频详情 **/
func (a *App) GetVideoDetail(params biliClient.GetVideoDetailParams) (biliClient.VideoDetailResponse, error) {
	return a.client.GetVideoDetail(params)
}

/** 获取视频地址 **/
func (a *App) GetVideoUrl(params biliClient.GetVideoUrlParams) (biliClient.VideoUrlResponse, error) {
	return a.client.GetVideoUrl(params)
}
