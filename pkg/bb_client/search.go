package bb_client

import "fmt"

type SearchParams struct {
	Keyword string `json:"keyword"`
	Page    string `json:"page"`
}

type SearchResponse struct {
	Pagination
	Result []SearchResultItem `json:"result"`
}

// 搜索
func (c *Client) Search(params SearchParams) (SearchResponse, error) {
	query := c.Sign(map[string]string{
		"search_type": "video",
		"keyword":     params.Keyword,
		"page":        params.Page,
	})
	url := "https://api.bilibili.com/x/web-interface/wbi/search/type"
	result := BiliResponse[SearchResponse]{}
	_, err := c.Request().SetQueryParams(query).SetResult(&result).Get(url)
	fmt.Printf("Search: %+vs\n", result)
	if err != nil {
		return SearchResponse{}, err
	}
	if err := ValidateResp(result); err != nil {
		return SearchResponse{}, err
	}
	return result.Data, nil
}