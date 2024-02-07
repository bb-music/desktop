package bb_client

import "fmt"

type GetVideoDetailParams struct {
	Aid  string `json:"aid"`
	Bvid string `json:"bvid"`
}

// 视频详情
// https://socialsisteryi.github.io/bilibili-API-collect/docs/video/info.html#%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF-web%E7%AB%AF
func (c *Client) GetVideoDetail(params GetVideoDetailParams) (VideoDetailResponse, error) {
	query := map[string]string{
		"aid":  params.Aid,
		"bvid": params.Bvid,
	}
	url := "https://api.bilibili.com/x/web-interface/view"
	result := BiliResponse[VideoDetailResponse]{}
	resp, err := c.Request().SetQueryParams(query).SetResult(&result).Get(url)
	if err != nil {
		return VideoDetailResponse{}, err
	}
	if err := ValidateResp(result); err != nil {
		return VideoDetailResponse{}, err
	}
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

// 视频流地址
// https://socialsisteryi.github.io/bilibili-API-collect/docs/video/videostream_url.html#%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91%E6%B5%81%E5%9C%B0%E5%9D%80-web%E7%AB%AF
func (c *Client) GetVideoUrl(params GetVideoUrlParams) (VideoUrlResponse, error) {
	query := c.Sign(map[string]string{
		"aid":  params.Aid,
		"bvid": params.Bvid,
		"cid":  params.Cid,
	})
	url := "https://api.bilibili.com/x/player/wbi/playurl"
	result := BiliResponse[VideoUrlResponse]{}
	_, err := c.Request().SetQueryParams(query).SetResult(&result).Get(url)
	if err != nil {
		return VideoUrlResponse{}, err
	}
	if err := ValidateResp(result); err != nil {
		return VideoUrlResponse{}, err
	}
	return result.Data, nil
}
