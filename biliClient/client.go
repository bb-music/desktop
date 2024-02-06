package biliClient

import (
	"errors"
	"fmt"
)

type Client struct {
	SignData SignData `json:"sing_data"`
}

func (c *Client) New() {
	// _, err := c.LoadSignData()
	// if err != nil {
	// 	return err
	// }
	// return nil
}

func (c *Client) LoadSignData() (SignData, error) {
	if data, err := GetWbiKeysApi(); err != nil {
		return SignData{}, err
	} else {
		c.SignData = data
		return data, nil
	}
}

func (c *Client) UpdateSignData(data SignData) error {
	fmt.Printf("SignData %+v", data)
	if data.ImgKey == "" {
		return errors.New("ImgKey 不能为空")
	}
	if data.SubKey == "" {
		return errors.New("SubKey 不能为空")
	}
	c.SignData = data
	return nil
}

func (c *Client) Sign(params map[string]string) map[string]string {
	if c.SignData.ImgKey == "" || c.SignData.SubKey == "" {
		c.LoadSignData()
	}
	return EncWbi(params, c.SignData.ImgKey, c.SignData.SubKey)
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
	resp, err := Request().SetQueryParams(query).SetResult(&result).Get(url)
	fmt.Printf("\nRESP %+v \n", resp)
	if err != nil {
		fmt.Printf("搜索出错 %+v", err)
		return SearchResponse{}, err
	}
	return result.Data, nil
}

type GetVideoDetailParams struct {
	Aid  string `json:"aid"`
	Bvid string `json:"bvid"`
}

/**
* 视频详情
* https://socialsisteryi.github.io/bilibili-API-collect/docs/video/info.html#%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF-web%E7%AB%AF
 */
func (c *Client) GetVideoDetail(params GetVideoDetailParams) (VideoDetailResponse, error) {
	query := map[string]string{
		"aid":  params.Aid,
		"bvid": params.Bvid,
	}
	url := "https://api.bilibili.com/x/web-interface/view"
	result := BiliResponse[VideoDetailResponse]{}
	resp, err := Request().SetQueryParams(query).SetResult(&result).Get(url)
	fmt.Printf("resp %+v", resp)
	if err != nil {
		fmt.Printf("获取详情出错 %+v", err)
		return VideoDetailResponse{}, err
	}
	return result.Data, nil
}

type GetVideoUrlParams struct {
	GetVideoDetailParams
	Cid string `json:"cid"`
}

/**
* 视频流地址
* https://socialsisteryi.github.io/bilibili-API-collect/docs/video/videostream_url.html#%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91%E6%B5%81%E5%9C%B0%E5%9D%80-web%E7%AB%AF
 */
func (c *Client) GetVideoUrl(params GetVideoUrlParams) (VideoUrlResponse, error) {
	query := c.Sign(map[string]string{
		"aid":  params.Aid,
		"bvid": params.Bvid,
		"cid":  params.Cid,
	})
	url := "https://api.bilibili.com/x/player/wbi/playurl"
	result := BiliResponse[VideoUrlResponse]{}
	_, err := Request().SetQueryParams(query).SetResult(&result).Get(url)
	if err != nil {
		fmt.Printf("获取地址出错 %+v", err)
		return VideoUrlResponse{}, err
	}
	return result.Data, nil
}
