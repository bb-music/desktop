/**
 * 签名相关
 **/
package bb_client

import (
	"errors"
	"fmt"
)

type SignData struct {
	ImgKey string `json:"img_key"`
	SubKey string `json:"sub_key"`
}

// func (c * Client) Get

// 获取 key
func (c *Client) LoadSignData() (SignData, error) {
	if data, err := GetWbiKeysApi(); err != nil {
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
