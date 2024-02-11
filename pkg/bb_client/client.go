package bb_client

import (
	"fmt"

	"github.com/go-resty/resty/v2"
)

type Client struct {
	SignData SignData `json:"sing_data"`
	SpiData  SpiData  `json:"spi_data"`
}

func New() *Client {
	return &Client{}
}

// func (c *Client) Init() error {
// 	// 加载 SPI
// 	if _, err := c.GetSpiData(); err != nil {
// 		return err
// 	}
// 	// 加载 签名
// 	if _, err := c.GetSignData(); err != nil {
// 		return err
// 	}
// 	return nil
// }

func (c *Client) Request() *resty.Request {
	client := resty.New()
	cookie := fmt.Sprintf("buvid4=%+v; buvid3=%+v;", c.SpiData.UUID_V4, c.SpiData.UUID_V3)
	fmt.Printf("cookie: %+v\n", cookie)
	req := client.R().SetHeader("Cookie", cookie).SetHeader("User-Agent", UserAgent)
	return req
}
