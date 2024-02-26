// 管理访问 哔哩哔哩 所需的配置信息
package app_bili

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/OpenBBMusic/desktop/pkg/bili_sdk"
	"github.com/OpenBBMusic/desktop/pkg/file_storage"
)

type Config struct {
	SignData bili_sdk.SignData `json:"sign_data"`
	SpiData  bili_sdk.SpiData  `json:"spi_data"`
}

type CacheConfig struct {
	Config
	CreatedAt time.Time `json:"created_at"`
}

var ConfigCacheKey = "bili-config.json"

// 初始化配置信息
func (a *App) InitConfig() error {
	var signData bili_sdk.SignData
	var spiData bili_sdk.SpiData

	// 获取
	configStorage := NewConfigStorage(a.cacheDir)
	cacheConfig := configStorage.Get()

	// 校验
	if configStorage.Validate(cacheConfig) {
		log.Println("bili 缓存配置已过期")
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
		configStorage.Set(CacheConfig{
			Config: Config{
				SignData: signData,
				SpiData:  spiData,
			},
			CreatedAt: time.Now(),
		})
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

type ConfigStorage struct {
	storage *file_storage.FileStorage
}

// 获取缓存的配置信息
func (c *ConfigStorage) Get() CacheConfig {
	// 读缓存
	cacheConfigStr, _ := c.storage.GetStorage(ConfigCacheKey)
	cacheConfig := &CacheConfig{}
	// 序列化为 json
	if err := json.Unmarshal([]byte(cacheConfigStr), cacheConfig); err != nil {
		log.Printf("bili 缓存配置不存在 | %+v\n", err)
	}
	return *cacheConfig
}

func (c *ConfigStorage) Set(config CacheConfig) error {
	cacheConfigStr, _ := json.Marshal(config)
	// 写缓存
	return c.storage.SetStorage(ConfigCacheKey, string(cacheConfigStr))
}

func (c *ConfigStorage) Validate(config CacheConfig) bool {
	return config.CreatedAt.Add(time.Hour * 24).Before(time.Now())
}

func NewConfigStorage(rootDir string) *ConfigStorage {
	return &ConfigStorage{
		storage: file_storage.New(rootDir),
	}
}
