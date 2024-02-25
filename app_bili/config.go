// 管理访问 哔哩哔哩 所需的配置信息
package app_bili

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/OpenBBMusic/desktop/pkg/bb_client"
)

type Config struct {
	SignData bb_client.SignData `json:"sign_data"`
	SpiData  bb_client.SpiData  `json:"spi_data"`
}

type CacheConfig struct {
	Config
	CreatedAt time.Time `json:"created_at"`
}

var ConfigCacheKey = "bili-config.json"

// 初始化配置信息
func (a *App) InitConfig() error {
	var signData bb_client.SignData
	var spiData bb_client.SpiData
	// 读缓存
	// 读缓存
	cacheConfigStr, _ := a.cacheStorage.GetStorage(ConfigCacheKey)
	cacheConfig := &CacheConfig{}
	// 序列化为 json
	if err := json.Unmarshal([]byte(cacheConfigStr), cacheConfig); err != nil {
		log.Printf("bili 缓存配置不存在 | %+v\n", err)
	}

	if cacheConfig.CreatedAt.Add(time.Hour * 24).Before(time.Now()) {
		log.Println("bili 缓存配置已过期 ")
		// 获取秘钥配置
		if data, err := a.client.GetSignData(); err != nil {
			return err
		} else {
			signData = data
		}

		// 获取 Spi 配置
		if data, err := a.client.GetSpiData(); err != nil {
			return err
		} else {
			spiData = data
		}

		// 结构体转换为 json 字符串
		cacheConfigStr, _ := json.Marshal(
			CacheConfig{
				Config: Config{
					SignData: signData,
					SpiData:  spiData,
				},
				CreatedAt: time.Now(),
			},
		)
		a.cacheStorage.SetStorage(ConfigCacheKey, string(cacheConfigStr))
	} else {
		signData = cacheConfig.SignData
		spiData = cacheConfig.SpiData
	}

	a.config.SignData = signData
	a.config.SpiData = spiData
	a.client.SignData = signData
	a.client.SpiData = spiData

	fmt.Printf("AppConfig: %+v\n", a.config)

	return nil
}

// 初始化配置信息
func (a *App) GetConfig() any {
	return *a.config
}

// 用于导出一个类型给前端
func (a *App) ExportConfig() *Config {
	return a.config
}
