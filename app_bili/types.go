package app_bili

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

// type MusicItem struct {
// 	AID       int                `json:"aid"`
// 	BVID      string             `json:"bvid"`
// 	CID       int                `json:"cid"`
// 	Name      string             `json:"name"`
// 	Duration  int                `json:"duration"`
// 	ID        string             `json:"id"`
// 	Origin    string             `json:"origin"`
// 	ExtraData MusicItemExtraData `json:"extraData"`
// }

// type MusicItemExtraData struct {
// 	Aid  int    `json:"aid"`
// 	Bvid string `json:"bvid"`
// 	Cid  int    `json:"cid"`
// }

type DownloadMusicParams struct {
	ID          string     `json:"id"`
	Origin      OriginType `json:"origin"`
	Name        string     `json:"name"`
	DownloadDir string     `json:"download_dir"`
}

type MusicItem struct {
	ID       string     `json:"id"`       // ID
	Cover    string     `json:"cover"`    // 封面
	Name     string     `json:"name"`     // 名称
	Duration int        `json:"duration"` // 时长
	Author   string     `json:"author"`   // 作者
	Origin   OriginType `json:"origin"`   // 来源
}

type SearchItem struct {
	ID        string      `json:"id"`        // ID
	Cover     string      `json:"cover"`     // 封面
	Name      string      `json:"name"`      // 名称
	Duration  int         `json:"duration"`  // 时长
	Author    string      `json:"author"`    // 作者
	Type      SearchType  `json:"type"`      // 类型
	Origin    OriginType  `json:"origin"`    // 来源
	MusicList []MusicItem `json:"musicList"` // 音乐列表 Type 为 order 时会有
}

type SearchResponse struct {
	Current  uint         `json:"current"`  // 当前页
	Total    uint         `json:"total"`    // 总数
	PageSize uint         `json:"pageSize"` // 每页数量
	Data     []SearchItem `json:"data"`     // 列表结果
}
