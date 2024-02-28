/**
 * 签名相关
 **/
package bili_sdk

import (
	"strings"
)

type SignData struct {
	ImgKey string `json:"img_key"`
	SubKey string `json:"sub_key"`
}

type SpiData struct {
	UUID_V3 string `json:"b_3"`
	UUID_V4 string `json:"b_4"`
}

// 获取认证秘钥
func (c *Client) GetSignData() (*SignData, error) {
	result := BiliResponse[BiliWbiKeysResult]{}

	_, err := c.Request().SetResult(&result).Get("https://api.bilibili.com/x/web-interface/nav")
	if err != nil {
		return nil, err
	}

	// 这里不能先根据 code 来判断返回结果了
	if result.Data.WbiImg.ImgUrl == "" || result.Data.WbiImg.SubUrl == "" {
		if err := ValidateResp(result); err != nil {
			return nil, err
		}
	}

	imgURL := result.Data.WbiImg.ImgUrl
	subURL := result.Data.WbiImg.SubUrl

	imgKey := strings.Split(strings.Split(imgURL, "/")[len(strings.Split(imgURL, "/"))-1], ".")[0]
	subKey := strings.Split(strings.Split(subURL, "/")[len(strings.Split(subURL, "/"))-1], ".")[0]

	data := SignData{
		imgKey,
		subKey,
	}
	return &data, err
}

// 获取 spi
func (c *Client) GetSpiData() (*SpiData, error) {
	result := BiliResponse[SpiData]{}
	_, err := c.Request().SetResult(&result).Get("https://api.bilibili.com/x/frontend/finger/spi")
	if err != nil {
		return nil, err
	}
	if err := ValidateResp(result); err != nil {
		return nil, err
	}
	return &result.Data, nil
}

// 对参数进行签名
func (c *Client) sign(params map[string]string) map[string]string {
	if c.SignData.ImgKey == "" || c.SignData.SubKey == "" {
		c.GetSignData()
	}
	return EncWbi(params, c.SignData.ImgKey, c.SignData.SubKey)
}
