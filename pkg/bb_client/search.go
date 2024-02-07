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

func (c *Client) Search(params SearchParams) (SearchResponse, error) {
	query := c.Sign(map[string]string{
		"search_type": "video",
		"keyword":     params.Keyword,
		"page":        params.Page,
	})
	url := "https://api.bilibili.com/x/web-interface/wbi/search/type"
	result := BiliResponse[SearchResponse]{}
	resp, err := Request().SetQueryParams(query).SetResult(&result).Get(url)
	fmt.Printf("\nRESP %+v \n", resp)
	if err != nil {
		fmt.Printf("搜索出错 %+v", err)
		return SearchResponse{}, err
	}
	return result.Data, nil
}
