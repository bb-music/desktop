package app

import "bbmusic/pkg/bb_client"

// 搜索视频
func (a *App) Search(params bb_client.SearchParams, auth AuthParams) (bb_client.SearchResponse, error) {
	client := &bb_client.Client{
		SignData: auth.SignData,
		SpiData:  auth.SpiData,
	}
	return client.Search(params)
}
