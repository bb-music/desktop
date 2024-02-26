package app_bili

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/OpenBBMusic/desktop/pkg/bb_type"
	"github.com/OpenBBMusic/desktop/pkg/bili_sdk"
	"github.com/duke-git/lancet/v2/slice"
)

// 搜索视频
func (a *App) Search(params bb_type.SearchParams) (bb_type.SearchResponse, error) {
	result := bb_type.SearchResponse{}
	raw, err := a.client.Search(bili_sdk.SearchParams{
		Keyword: params.Keyword,
		Page:    params.Page,
	})
	if err != nil {
		return result, err
	}

	res := bb_type.SearchResponse{
		Current:  raw.Page,
		Total:    raw.NumResults,
		PageSize: raw.PageSize,
		Data:     []bb_type.SearchItem{},
	}

	for _, item := range raw.Result {
		if !slice.Contain([]string{"ketang"}, item.Type) {
			// 类型为 ketang 的去掉
			value := bb_type.SearchItem{
				ID:       DecodeBiliSearchItemId(item.Aid, item.Bvid),
				Cover:    item.Pic,
				Name:     item.Title,
				Duration: Duration2Seconds(item.Duration),
				Author:   item.Author,
				Type:     bb_type.SearchTypeMusic,
				Origin:   bb_type.BiliOriginName,
			}
			res.Data = append(res.Data, value)
		}
	}
	return res, nil
}

// 详情
func (a *App) SearchDetail(id string) (bb_type.SearchItem, error) {
	biliid, err := UnicodeBiliId(id)
	if err != nil {
		return bb_type.SearchItem{}, err
	}

	info, err := a.client.GetVideoDetail(biliid.Aid, biliid.Bvid)

	result := bb_type.SearchItem{
		ID:       DecodeBiliMusicItemId(info.Aid, info.Bvid, info.Cid),
		Cover:    info.Pic,
		Name:     info.Title,
		Duration: info.Duration,
		Author:   "",
		Origin:   bb_type.BiliOriginName,
		Type:     bb_type.SearchTypeMusic,
	}
	if info.Videos > 1 {
		// 歌单的 ID 和 Type 变一下
		result.ID = DecodeBiliSearchItemId(info.Aid, info.Bvid)
		result.Type = bb_type.SearchTypeOrder
		for _, item := range info.Pages {
			result.MusicList = append(result.MusicList, bb_type.MusicItem{
				ID:       DecodeBiliMusicItemId(info.Aid, info.Bvid, item.Cid),
				Cover:    item.FirstFrame,
				Name:     item.Part,
				Duration: item.Duration,
				Author:   "",
				Origin:   bb_type.BiliOriginName,
			})
		}
	}

	return result, err
}

// 将 mm:ss 格式的时间转换为 秒
func Duration2Seconds(durationStr string) int {
	if durationStr == "" {
		return 0
	}
	// 按":"分割字符串并转换为整数
	parts := strings.Split(durationStr, ":")
	if len(parts) < 2 {
		return 0
	}
	minutes, err := strconv.Atoi(parts[0])
	if err != nil {
		return 0
	}
	seconds, err := strconv.Atoi(parts[1])
	if err != nil {
		return 0
	}
	// 返回分钟数乘以 60 再加上秒数
	return minutes*60 + seconds
}

// 将 aid bvid 合并为 ID
func DecodeBiliSearchItemId(aid int, bvid string) string {
	return fmt.Sprintf("%+v_%+v", aid, bvid)
}

// 将 aid bvid cid 合并为 ID
func DecodeBiliMusicItemId(aid int, bvid string, cid int) string {
	return fmt.Sprintf("%+v_%+v_%+v", aid, bvid, cid)
}

type BiliId struct {
	Aid  string `json:"aid"`
	Bvid string `json:"bvid"`
	Cid  string `json:"cid"`
}

// 将 ID 转为 aid bvid cid
func UnicodeBiliId(id string) (BiliId, error) {
	result := BiliId{}
	parts := strings.Split(id, "_")
	if len(parts) < 2 {
		return result, errors.New("ID 格式不正确")
	}
	result.Aid = parts[0]
	result.Bvid = parts[1]

	if len(parts) > 2 {
		result.Cid = parts[2]
	}

	return result, nil
}
