package bb_client

import "fmt"

type BiliReqError[T any] struct {
	Code    int             `json:"code"`
	Message string          `json:"message"`
	Resp    BiliResponse[T] `json:"resp"`
}

func (r *BiliReqError[T]) Error() string {
	return fmt.Sprintf("bili请求出现错误 %d: %s", r.Code, r.Message)
}
