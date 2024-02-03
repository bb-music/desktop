package biliClient

import (
	"strings"
)

func GetWbiKeysApi() (SignData, error) {
	result := BiliResponse[WbiKeysResult]{}

	_, err := Request().SetResult(&result).Get("https://api.bilibili.com/x/web-interface/nav")

	imgURL := result.Data.WbiImg.ImgUrl
	subURL := result.Data.WbiImg.SubUrl

	imgKey := strings.Split(strings.Split(imgURL, "/")[len(strings.Split(imgURL, "/"))-1], ".")[0]
	subKey := strings.Split(strings.Split(subURL, "/")[len(strings.Split(subURL, "/"))-1], ".")[0]

	return SignData{
		imgKey,
		subKey,
	}, err
}
