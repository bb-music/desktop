package server

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/signal"
	"strconv"
	"time"

	"github.com/OpenBBMusic/desktop/app_bili"
	"github.com/OpenBBMusic/desktop/pkg/bb_type"
	"github.com/OpenBBMusic/desktop/server/middlewares"
	"github.com/OpenBBMusic/desktop/server/resp"
	"github.com/gin-gonic/gin"
)

type OriginService interface {
	GetConfig() any
	InitConfig() error
	Search(params bb_type.SearchParams) (bb_type.SearchResponse, error)
	SearchDetail(id string) (bb_type.SearchItem, error)
	GetMusicFile(id string) (*httputil.ReverseProxy, *http.Request, error)
	DownloadMusic(params bb_type.DownloadMusicParams) (string, error)
}

type BBServer struct {
	router *gin.Engine
	srv    *http.Server
}

func (s *BBServer) Run() {
	go func() {
		// 服务连接
		if err := s.srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Println("服务启动失败:", "err", err)
			panic(err)
		}
	}()

	// 等待中断信号以优雅地关闭服务器（设置 5 秒的超时时间）
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit
	fmt.Println("服务关闭中...")

	s.Close()
}
func (s *BBServer) Close() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := s.srv.Shutdown(ctx); err != nil {
		log.Println("服务关闭失败:", "err", err)
		panic(err)
	}
	fmt.Println("服务已退出")
}

func New(port int, cacheDir string) BBServer {
	log.Println("======= 服务启动 =======")
	log.Println("端口:", port)
	log.Println("缓存目录:", cacheDir)
	log.Println("注册音乐源服务")

	bili := app_bili.New(cacheDir)
	// 注册源服务
	service := map[bb_type.OriginType]OriginService{
		bb_type.BiliOriginName: bili,
	}
	bili.InitConfig()

	// 初始化 gin
	r := gin.New()
	r.Use(middlewares.Cors(), gin.Recovery())

	// 获取源的配置信息
	r.GET("/", func(ctx *gin.Context) {
		ctx.String(200, "欢迎使用 哔哔音乐 API 服务")
	})

	g := r.Group("/api")

	// 获取源的配置信息
	g.GET("/config/:origin", func(ctx *gin.Context) {
		origin := ctx.Param("origin")
		data := service[origin].GetConfig()
		ctx.JSON(resp.Success(data, "查询成功"))
	})

	// 搜索音乐
	g.GET("/search/:origin", func(ctx *gin.Context) {
		origin := ctx.Param("origin")
		keyword := ctx.Query("keyword")
		page := ctx.DefaultQuery("page", "1")

		data, err := service[origin].Search(bb_type.SearchParams{
			Keyword: keyword,
			Page:    page,
		})
		if err != nil {
			ctx.JSON(resp.ServerErr(err, "查询失败"))
			return
		}
		ctx.JSON(resp.Success(data, "查询成功"))
	})

	// 搜索音乐结果详情
	g.GET("/search/:origin/:id", func(ctx *gin.Context) {
		origin := ctx.Param("origin")
		id := ctx.Param("id")

		data, err := service[origin].SearchDetail(id)
		if err != nil {
			ctx.JSON(resp.ServerErr(err, "查询失败"))
			return
		}
		ctx.JSON(resp.Success(data, "查询成功"))
	})

	// 音乐播放地址 返回音乐流
	g.GET("/music/file/:origin/:id", func(ctx *gin.Context) {
		origin := ctx.Param("origin")
		id := ctx.Param("id")

		proxy, req, err := service[origin].GetMusicFile(id)

		if err != nil {
			ctx.JSON(resp.ServerErr(err, "获取歌曲文件失败"))
			return
		}

		proxy.ServeHTTP(ctx.Writer, req)
	})

	// 获取歌单广场歌单 后面传入源地址
	g.GET("/open-music-order", func(ctx *gin.Context) {
		originUrl := ctx.Query("origin")

		raw, err := http.Get(originUrl)

		defer raw.Body.Close()

		if err != nil || raw.StatusCode != 200 {
			ctx.JSON(resp.ServerErr(err, "请求失败"))
			return
		}

		if body, err := io.ReadAll(raw.Body); err != nil {
			ctx.JSON(resp.ServerErr(err, "数据读取失败"))
			return
		} else {
			result := []bb_type.MusicOrderItem{}
			if err := json.Unmarshal(body, &result); err != nil {
				ctx.JSON(resp.ServerErr(err, "json 序列化失败"))
				return
			}
			ctx.JSON(resp.Success(result, "请求成功"))
		}
	})

	// 图片代理服务
	g.GET("/img-proxy", func(ctx *gin.Context) {
		imgUrl := ctx.Query("url")
		u, err := url.Parse(imgUrl)
		if err != nil {
			ctx.JSON(resp.ServerErr(err, "图片地址错误请检查"))
			return
		}

		proxy := httputil.NewSingleHostReverseProxy(u)

		req, err := http.NewRequest("GET", imgUrl, nil)
		if err != nil {
			ctx.JSON(resp.ServerErr(err, "图片请求出错"))
			return
		}
		proxy.ServeHTTP(ctx.Writer, req)
	})

	// r.Run(fmt.Sprintf(":%d", port))

	return BBServer{
		srv: &http.Server{
			Addr:    ":" + strconv.Itoa(port),
			Handler: r,
		},
	}
}
