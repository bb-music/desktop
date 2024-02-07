/**
 * 签名相关
 **/
package bb_client

import (
	"errors"
	"fmt"
	"strings"
)

type SignData struct {
	ImgKey string `json:"img_key"`
	SubKey string `json:"sub_key"`
}

func (c *Client) GetWbiKeysApi() (SignData, error) {
	result := BiliResponse[WbiKeysResult]{}

	_, err := c.Request().SetResult(&result).Get("https://api.bilibili.com/x/web-interface/nav")

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

func (c *Client) LoadSpiData() (SpiData, error) {
	result := BiliResponse[SpiData]{}
	_, err := c.Request().SetResult(&result).Get("https://api.bilibili.com/x/frontend/finger/spi")
	if err != nil {
		return SpiData{}, err
	}
	c.SpiData = result.Data
	return result.Data, nil

}

// 获取 key
func (c *Client) LoadSignData() (SignData, error) {
	if data, err := c.GetWbiKeysApi(); err != nil {
		return SignData{}, err
	} else {
		c.SignData = data
		return data, nil
	}
}

// 更新 key
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

// 对参数进行签名
func (c *Client) Sign(params map[string]string) map[string]string {
	if c.SignData.ImgKey == "" || c.SignData.SubKey == "" {
		c.LoadSignData()
	}
	return EncWbi(params, c.SignData.ImgKey, c.SignData.SubKey)
}
