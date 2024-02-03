package app

import (
	"bbmusic/biliClient"
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx    context.Context
	client biliClient.Client
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	fmt.Println("======= START =======")
	a.client = biliClient.Client{}
	if err := a.client.New(); err != nil {
		fmt.Println("请求秘钥出错")
	}
}

func (a *App) Search(params biliClient.SearchParams) biliClient.SearchResponse {
	res, _ := a.client.Search(params)
	return res
}
