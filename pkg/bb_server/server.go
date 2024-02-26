package bb_server

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"time"
)

// 用于优雅的启动和停止 http 服务
type Server struct {
	srv     *http.Server
	Println func(...any)
}

func (s *Server) Run() {
	go func() {
		// 服务连接
		if err := s.srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			s.Println("Err | 服务启动失败:", "err", err)
			panic(err)
		}
	}()

	// 等待中断信号以优雅地关闭服务器（设置 5 秒的超时时间）
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit
	s.Println("服务关闭中...")
	s.Close()
}
func (s *Server) Close() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := s.srv.Shutdown(ctx); err != nil {
		s.Println("Err | 服务关闭失败:", "err", err)
		panic(err)
	}
	s.Println("服务已退出")
}

func New(srv *http.Server, Println func(...any)) *Server {
	return &Server{
		srv:     srv,
		Println: Println,
	}
}
