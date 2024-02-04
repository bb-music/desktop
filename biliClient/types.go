package biliClient

type BiliResponse[T any] struct {
	Code    int16  `json:"code"`
	Message string `json:"message"`
	Ttl     uint64 `json:"ttl"`
	Data    T      `json:"data"`
}

type WbiKeysData struct {
	ImgUrl string `json:"img_url"`
	SubUrl string `json:"sub_url"`
}

type WbiKeysResult struct {
	IsLogin bool        `json:"isLogin"`
	WbiImg  WbiKeysData `json:"wbi_img"`
}

type SignData struct {
	ImgKey string `json:"img_key"`
	SubKey string `json:"sub_key"`
}

type Pagination struct {
	Page       uint `json:"page"`       // 当前页码
	PageSize   uint `json:"pagesize"`   // 每页条数（固定20）
	NumResults uint `json:"numResults"` // 总条数
	NumPages   uint `json:"numPages"`   // 总计分页数
}

/** 搜索结果 */
type SearchResultItem struct {
	Type             string   `json:"type"`
	Id               int      `json:"id"`
	Author           string   `json:"author"`
	Mid              int      `json:"mid"`
	Typeid           string   `json:"typeid"`
	Typename         string   `json:"typename"`
	Arcurl           string   `json:"arcurl"`
	Aid              int      `json:"aid"`
	Bvid             string   `json:"bvid"`
	Title            string   `json:"title"`
	Description      string   `json:"description"`
	Arcrank          string   `json:"arcrank"`
	Pic              string   `json:"pic"`
	Play             int      `json:"play"`
	VideoReview      int      `json:"video_review"`
	Favorites        int      `json:"favorites"`
	Tag              string   `json:"tag"`
	Review           int      `json:"review"`
	Pubdate          int      `json:"pubdate"`
	Senddate         int      `json:"senddate"`
	Duration         string   `json:"duration"`
	Badgepay         bool     `json:"badgepay"`
	HitColumns       []string `json:"hit_columns,omitempty"`
	ViewType         string   `json:"view_type"`
	IsPay            int      `json:"is_pay"`
	IsUnionVideo     int      `json:"is_union_video"`
	RecTags          []string `json:"rec_tags,omitempty"`
	NewRecTags       []string `json:"new_rec_tags,omitempty"`
	RankScore        float64  `json:"rank_score"`
	Like             int      `json:"like"`
	Upic             string   `json:"upic"`
	Corner           string   `json:"corner"`
	Cover            string   `json:"cover"`
	Desc             string   `json:"desc"`
	Url              string   `json:"url"`
	RecReason        string   `json:"rec_reason"`
	Danmaku          int      `json:"danmaku"`
	BizData          []string `json:"biz_data,omitempty"`
	IsChargeVideo    int      `json:"is_charge_video"`
	Vt               int      `json:"vt"`
	EnableVt         int      `json:"enable_vt"`
	VtDisplay        string   `json:"vt_display"`
	Subtitle         string   `json:"subtitle"`
	EpisodeCountText string   `json:"episode_count_text"`
	ReleaseStatus    int      `json:"release_status"`
	IsIntervene      int      `json:"is_intervene"`
}

/** 视频详情 */
type VideoDetailResponse struct {
	Bvid      string            `json:"bvid"`
	Aid       int               `json:"aid"`
	Videos    int               `json:"videos"`     // 视频数
	Tid       int               `json:"tid"`        // 分区 tid
	Tname     string            `json:"tname"`      // 子分区名称
	Copyright int               `json:"copyright"`  // 视频类型1：原创 2：转载
	Pic       string            `json:"pic"`        // 稿件封面图片url
	Title     string            `json:"title"`      // 稿件标题
	Pubdate   int               `json:"pubdate"`    // 稿件发布时间
	Ctime     int               `json:"ctime"`      // 用户投稿时间
	Desc      string            `json:"desc"`       // 描述
	DescV2    []Descv2          `json:"desc_v2"`    // 描述 v2
	State     int               `json:"state"`      // 状态
	Duration  int               `json:"duration"`   // 时长
	Rights    Rights            `json:"rights"`     // 视频属性标志
	Owner     Owner             `json:"owner"`      // 视频UP主信息
	ArgueInfo Argueinfo         `json:"argue_info"` // 争议/警告信息
	Dynamic   string            `json:"dynamic"`    // 视频同步发布的的动态的文字内容
	Cid       int               `json:"cid"`        // 视频1P cid
	Dimension Dimension         `json:"dimension"`  // 视频1P分辨率
	Pages     []VideoDetailPage `json:"pages"`      // part列表
	Subtitle  Subtitle          `json:"subtitle"`
}

// Define other structs with tags as required

type Descv2 struct {
	RawText string `json:"raw_text"`
	Type    int8   `json:"type"`
	BizId   int8   `json:"biz_id"`
}

/** 视频属性标志 **/
type Rights struct {
	BP            int `json:"bp"`
	Elec          int `json:"elec"`
	Download      int `json:"download"`
	Movie         int `json:"movie"`
	Pay           int `json:"pay"`
	HD5           int `json:"hd5"`
	NoReprint     int `json:"no_reprint"`
	Autoplay      int `json:"autoplay"`
	UGCPay        int `json:"ugc_pay"`
	IsCooperation int `json:"is_cooperation"`
	UGCPayPreview int `json:"ugc_pay_preview"`
	NoBackground  int `json:"no_background"`
	CleanMode     int `json:"clean_mode"`
	IsSteinGate   int `json:"is_stein_gate"`
	Is360         int `json:"is_360"`
	NoShare       int `json:"no_share"`
	ArcPay        int `json:"arc_pay"`
	FreeWatch     int `json:"free_watch"`
}

type Owner struct {
	Mid  int    `json:"mid"`
	Name string `json:"name"`
	Face string `json:"face"`
}

type Argueinfo struct {
	ArgueMsg  string `json:"argue_msg"`
	ArgueType int    `json:"argue_type"`
	ArgueLink string `json:"argue_link"`
}

type VideoDetailPage struct {
	Cid        int       `json:"cid"`
	Page       int       `json:"page"`
	From       string    `json:"from"`
	Part       string    `json:"part"`
	Duration   int       `json:"duration"`
	Vid        string    `json:"vid"`
	Weblink    string    `json:"weblink"`
	Dimension  Dimension `json:"dimension"`
	FirstFrame string    `json:"first_frame"`
}

type Dimension struct {
	Width  int `json:"width"`
	Height int `json:"height"`
	Rotate int `json:"rotate"`
}

type Subtitle struct {
	AllowSubmit bool
	List        []interface{}
}

type VideoUrlResponse struct {
	From              string          `json:"from"`
	Result            string          `json:"result"`
	Message           string          `json:"message"`
	Quality           int             `json:"quality"`
	Format            string          `json:"format"`
	Timelength        int             `json:"timelength"`
	AcceptFormat      string          `json:"accept_format"`
	AcceptDescription []string        `json:"accept_description"`
	AcceptQuality     []int           `json:"accept_quality"`
	VideoCodecid      int             `json:"video_codecid"`
	SeekParam         string          `json:"seek_param"`
	SeekType          string          `json:"seek_type"`
	Durl              []Durl          `json:"durl"`
	SupportFormats    []Supportformat `json:"support_formats"`
	HighFormat        interface{}     `json:"high_format,omitempty"`
	LastPlayTime      int             `json:"last_play_time"`
	LastPlayCid       int             `json:"last_play_cid"`
}

type Supportformat struct {
	Quality        int         `json:"quality"`
	Format         string      `json:"format"`
	NewDescription string      `json:"new_description"`
	DisplayDesc    string      `json:"display_desc"`
	Superscript    string      `json:"superscript"`
	Codecs         interface{} `json:"codecs,omitempty"`
}

type Durl struct {
	Order     int      `json:"order"`
	Length    int      `json:"length"`
	Size      int      `json:"size"`
	Ahead     string   `json:"ahead"`
	Vhead     string   `json:"vhead"`
	Url       string   `json:"url"`
	BackupUrl []string `json:"backup_url"`
}
