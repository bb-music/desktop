package bb_client

type Client struct {
	SignData SignData `json:"sing_data"`
}

func (c *Client) New() {
	// _, err := c.LoadSignData()
	// if err != nil {
	// 	return err
	// }
	// return nil
}
