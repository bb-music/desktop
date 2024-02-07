package bb_client

import "github.com/go-resty/resty/v2"

func Request() *resty.Request {
	client := resty.New()
	req := client.R().SetHeader("Cookie", "buvid4=3C0196E8-6E42-BB85-1A1C-E18650BBF01E76611-023121908-lrZ7m9qpTccHL/Ovh8Vwhg%3D%3D; buvid3=E413AC10-76AE-85C3-D845-96BDB36D7E0125335infoc;").SetHeader("User-Agent", UserAgent)
	return req
}
