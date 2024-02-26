package bb_type

// 音乐源类型
type OriginType = string

const (
	BiliOriginName    OriginType = "bili"    // 哔哩哔哩
	YouTubeOriginName OriginType = "youTube" // YouTube
)

// 搜索结果类型
type SearchType = string

const (
	SearchTypeMusic SearchType = "music" // 歌曲
	SearchTypeOrder SearchType = "order" // 歌单
)

// 歌单
type MusicOrderItem struct {
	ID        string      `json:"id"`         // 歌单 ID
	Name      string      `json:"name"`       // 名称
	Cover     string      `json:"cover"`      // 封面
	Desc      string      `json:"desc"`       // 描述
	Author    string      `json:"author"`     // 作者
	MusicList []MusicItem `json:"musicList"`  // 歌曲列表
	CreatedAt string      `json:"created_at"` // 创建时间
	UpdatedAt string      `json:"updated_at"` // 更新时间
}

// 下载音乐的参数
type DownloadMusicParams struct {
	ID          string     `json:"id"`
	Origin      OriginType `json:"origin"`
	Name        string     `json:"name"`
	DownloadDir string     `json:"download_dir"`
}

// 音乐信息
type MusicItem struct {
	ID       string     `json:"id"`       // ID
	Cover    string     `json:"cover"`    // 封面
	Name     string     `json:"name"`     // 名称
	Duration int        `json:"duration"` // 时长
	Author   string     `json:"author"`   // 作者
	Origin   OriginType `json:"origin"`   // 来源
}

// 搜索参数
type SearchParams struct {
	Keyword string `json:"keyword"` // 搜索关键字
	Page    string `json:"page"`    // 分页
}

// 搜索结果条目
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

// 搜索结果
type SearchResponse struct {
	Current  uint         `json:"current"`  // 当前页
	Total    uint         `json:"total"`    // 总数
	PageSize uint         `json:"pageSize"` // 每页数量
	Data     []SearchItem `json:"data"`     // 列表结果
}
