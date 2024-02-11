/**
 * 签名相关
 **/
package bb_client

import (
	"strings"
)

type SignData struct {
	ImgKey string `json:"img_key"`
	SubKey string `json:"sub_key"`
}

func (c *Client) getWbiKeysApi() (SignData, error) {
	result := BiliResponse[WbiKeysResult]{}

	_, err := c.Request().SetResult(&result).Get("https://api.bilibili.com/x/web-interface/nav")
	if err != nil {
		return SignData{}, err
	}

	// 这里不能先根据 code 来判断返回结果了
	if result.Data.WbiImg.ImgUrl == "" || result.Data.WbiImg.SubUrl == "" {
		if err := ValidateResp(result); err != nil {
			return SignData{}, err
		}
	}

	imgURL := result.Data.WbiImg.ImgUrl
	subURL := result.Data.WbiImg.SubUrl

	imgKey := strings.Split(strings.Split(imgURL, "/")[len(strings.Split(imgURL, "/"))-1], ".")[0]
	subKey := strings.Split(strings.Split(subURL, "/")[len(strings.Split(subURL, "/"))-1], ".")[0]

	return SignData{
		imgKey,
		subKey,
	}, err
}

type SpiData struct {
	UUID_V3 string `json:"b_3"`
	UUID_V4 string `json:"b_4"`
}

// 获取 spi
func (c *Client) GetSpiData() (SpiData, error) {
	result := BiliResponse[SpiData]{}
	_, err := c.Request().SetResult(&result).Get("https://api.bilibili.com/x/frontend/finger/spi")
	if err != nil {
		return SpiData{}, err
	}
	if err := ValidateResp(result); err != nil {
		return SpiData{}, err
	}
	return result.Data, nil

}

// 获取 key
func (c *Client) GetSignData() (SignData, error) {
	if data, err := c.getWbiKeysApi(); err != nil {
		return SignData{}, err
	} else {
		return data, nil
	}
}

// 对参数进行签名
func (c *Client) sign(params map[string]string) map[string]string {
	if c.SignData.ImgKey == "" || c.SignData.SubKey == "" {
		c.GetSignData()
	}
	return EncWbi(params, c.SignData.ImgKey, c.SignData.SubKey)
}
