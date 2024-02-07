package app

import (
	"bbmusic/pkg/bb_client"
	"io"
	"net"
	"net/http"
	"os"
)

// 随机取一个未占用的端口
func GetFreePort() (int, error) {
	addr, err := net.ResolveTCPAddr("tcp", "127.0.0.1:0")
	if err != nil {
		return 0, err
	}
	cli, err := net.ListenTCP("tcp", addr)
	if err != nil {
		return 0, err
	}
	defer cli.Close()
	return cli.Addr().(*net.TCPAddr).Port, nil
}

// 下载视频文件
func DownloadUrl(path string, url string) error {
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Referer", "https://www.bilibili.com/")
	req.Header.Set("Cookie", "")
	req.Header.Set("User-Agent", bb_client.UserAgent)

	resp, errA := http.DefaultClient.Do(req)
	if errA != nil {
		return errA
	}
	defer resp.Body.Close()

	outputFile, errB := os.Create(path)
	if errB != nil {
		return errB
	}
	defer outputFile.Close()

	if _, err := io.Copy(outputFile, resp.Body); err != nil {
		return err
	}

	return nil
}
