package bb_client

// 视频详情
// https://socialsisteryi.github.io/bilibili-API-collect/docs/video/info.html#%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF-web%E7%AB%AF
func (c *Client) GetVideoDetail(aid, bvid string) (VideoDetailResponse, error) {
	query := map[string]string{
		"aid":  aid,
		"bvid": bvid,
	}
	url := "https://api.bilibili.com/x/web-interface/view"
	result := BiliResponse[VideoDetailResponse]{}
	_, err := c.Request().SetQueryParams(query).SetResult(&result).Get(url)
	if err != nil {
		return VideoDetailResponse{}, err
	}
	if err := ValidateResp(result); err != nil {
		return VideoDetailResponse{}, err
	}
	if err != nil {
		return VideoDetailResponse{}, err
	}
	return result.Data, nil
}

// 视频流地址
// https://socialsisteryi.github.io/bilibili-API-collect/docs/video/videostream_url.html#%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91%E6%B5%81%E5%9C%B0%E5%9D%80-web%E7%AB%AF
func (c *Client) GetVideoUrl(aid, bvid, cid string) (VideoUrlResponse, error) {
	query := c.sign(map[string]string{
		"aid":  aid,
		"bvid": bvid,
		"cid":  cid,
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
