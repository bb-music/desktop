package biliClient

import "github.com/go-resty/resty/v2"

func Request() *resty.Request {
	client := resty.New()
	req := client.R().SetHeader("Cookie", "").SetHeader("User-Agent", UserAgent)
	return req
}
