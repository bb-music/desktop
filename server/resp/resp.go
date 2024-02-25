package resp

import (
	"net/http"
)

const (
	DefaultSuccessMsg    = "请求成功"
	DefaultErrorMsg      = "请求失败"
	DefaultParamErrorMsg = "请求参数错误"
)

type Result struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data any    `json:"data"`
}

// Success 成功返回
func Success(data any, msg string) (int, Result) {
	return http.StatusOK, Result{
		Code: 200,
		Msg:  msg,
		Data: data,
	}
}

// Success 成功返回
func Succ() (int, Result) {
	return http.StatusOK, Result{
		Code: 200,
		Msg:  "success",
		Data: nil,
	}
}

// Err 错误返回
func Err(data any, msg string, code int) Result {
	return Result{
		Code: code,
		Msg:  msg,
		Data: data,
	}
}

// ParamErr 请求参数错误返回
func ParamErr(msg string) (int, Result) {
	return http.StatusOK, Err(nil, msg, http.StatusBadRequest)
}

// ServerErr 服务器错误返回
func ServerErr(data any, msg string) (int, Result) {
	return http.StatusOK, Err(data, msg, http.StatusInternalServerError)
}

// AuthErr 认证错误
func AuthErr(msg string) (int, Result) {
	return http.StatusOK, Err(nil, msg, http.StatusUnauthorized)
}
