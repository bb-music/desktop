package app_bili

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/bb-music/desktop/pkg/bb_type"
)

// 获取歌单源数据
func (a *App) GetOpenMusicOrderList(originUrl string) (*[]bb_type.MusicOrderItem, error) {
	resp, err := http.Get(originUrl)
	if err != nil {
		a.logger.Error("请求歌单源数据失败", "originUrl="+originUrl, fmt.Sprintf("err=%+v", err))
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		a.logger.Error("获取歌单源数据失败", "originUrl="+originUrl, fmt.Sprintf("HttpStatusCode=%+v", resp.StatusCode), fmt.Sprintf("err=%+v", err))
		return nil, err
	}
	if body, err := io.ReadAll(resp.Body); err != nil {
		a.logger.Error("读取歌单源数据流失败", "originUrl="+originUrl, fmt.Sprintf("err=%+v", err))
		return nil, err
	} else {
		result := &[]bb_type.MusicOrderItem{}
		if err := json.Unmarshal(body, result); err != nil {
			a.logger.Error("歌单源数据 JSON 序列号失败", "originUrl="+originUrl, fmt.Sprintf("err=%+v", err))
			return nil, err
		}

		return result, nil
	}
}
