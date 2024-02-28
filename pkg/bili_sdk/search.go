package bili_sdk

import "github.com/bb-music/desktop/pkg/bb_type"

type SearchResponse struct {
	BiliPagination
	Result []BiliSearchResultItem `json:"result"`
}

// 搜索
func (c *Client) Search(params bb_type.SearchParams) (*SearchResponse, error) {
	query := c.sign(map[string]string{
		"search_type": "video",
		"keyword":     params.Keyword,
		"page":        params.Page,
	})
	url := "https://api.bilibili.com/x/web-interface/wbi/search/type"
	result := BiliResponse[SearchResponse]{}
	_, err := c.Request().SetQueryParams(query).SetResult(&result).Get(url)

	if err != nil {
		return nil, err
	}
	if err := ValidateResp(result); err != nil {
		return nil, err
	}
	return &result.Data, nil
}
