package app_bili

import (
	"encoding/json"
	"io"
	"net/http"
)

// 获取歌单源数据
func (a *App) GetOpenMusicOrderList(originUrl string) ([]MusicOrderItem, error) {
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
