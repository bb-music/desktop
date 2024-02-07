package app

import "bbmusic/pkg/bb_client"

// 搜索视频
func (a *App) Search(params bb_client.SearchParams) (bb_client.SearchResponse, error) {
	return a.client.Search(params)
}
