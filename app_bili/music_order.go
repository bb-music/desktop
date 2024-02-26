package app_bili

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/OpenBBMusic/desktop/pkg/bb_type"
)

// 获取歌单源数据
func (a *App) GetOpenMusicOrderList(originUrl string) ([]bb_type.MusicOrderItem, error) {
	resp, err := http.Get(originUrl)
	if err != nil {
		return []bb_type.MusicOrderItem{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return []bb_type.MusicOrderItem{}, err
	}
	if body, err := io.ReadAll(resp.Body); err != nil {
		return []bb_type.MusicOrderItem{}, err
	} else {
		result := []bb_type.MusicOrderItem{}
		if err := json.Unmarshal(body, &result); err != nil {
			return []bb_type.MusicOrderItem{}, err
		}

		return result, nil
	}
}
