package biliClient

import "fmt"

type Client struct {
	signData SignData
}

func (c *Client) New() error {
	if data, err := GetWbiKeysApi(); err != nil {
		return err
	} else {
		c.signData = data
		fmt.Println("初始化成功", data)
		return nil
	}
}

func (c *Client) Sign(params map[string]string) map[string]string {
	return EncWbi(params, c.signData.ImgKey, c.signData.SubKey)
}

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
	_, err := Request().SetQueryParams(query).SetResult(&result).Get(url)
	if err != nil {
		fmt.Printf("搜索出错 %+v", err)
		return SearchResponse{}, err
	}
	return result.Data, nil
}
