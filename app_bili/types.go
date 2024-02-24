package app_bili

import "github.com/OpenBBMusic/desktop/pkg/bb_client"

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

type DownloadMusicParams struct {
	bb_client.GetVideoUrlParams
	Name        string `json:"name"`
	DownloadDir string `json:"download_dir"`
}
