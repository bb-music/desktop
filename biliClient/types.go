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
	ImgKey string
	SubKey string
}

type Pagination struct {
	/** 当前页码 */
	Page uint
	/** 每页条数（固定20） */
	PageSize uint `json:"pagesize"`
	/** 总条数	 */
	NumResults uint `json:"numResults"`
	/** 总计分页数 */
	NumPages uint `json:"numPages"`
}

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
