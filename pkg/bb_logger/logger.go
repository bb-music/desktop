package bb_logger

type Logger interface {
	Info(message ...string)
	Warn(message ...string)
	Error(message ...string)
}

func NewDefaultLogger() *DefaultLogger {
	return &DefaultLogger{}
}

type DefaultLogger struct{}

func (l *DefaultLogger) Info(message ...string) {
	println("BiliSvc Info | ", message)
}
func (l *DefaultLogger) Warn(message ...string) {
	println("BiliSvc Warn | ", message)
}
func (l *DefaultLogger) Error(message ...string) {
	println("BiliSvc Err | ", message)
}
