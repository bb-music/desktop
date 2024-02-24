package logger

import (
	"log"
	"os"
)

// DefaultLogger is a utility to log messages to a number of destinations
type Logger struct{}

// NewDefaultLogger creates a new Logger.
func New() *Logger {
	return &Logger{}
}

// Print works like Sprintf.
func (l *Logger) Print(message string) {
	log.Panicln(message)
}

// Trace level logging. Works like Sprintf.
func (l *Logger) Trace(message string) {
	log.Println("TRA | " + message)
}

// Debug level logging. Works like Sprintf.
func (l *Logger) Debug(message string) {
	log.Println("DEB | " + message)
}

// Info level logging. Works like Sprintf.
func (l *Logger) Info(message string) {
	log.Println("INF | " + message)
}

// Warning level logging. Works like Sprintf.
func (l *Logger) Warning(message string) {
	log.Println("WAR | " + message)
}

// Error level logging. Works like Sprintf.
func (l *Logger) Error(message string) {
	log.Println("ERR | " + message)
}

// Fatal level logging. Works like Sprintf.
func (l *Logger) Fatal(message string) {
	log.Println("FAT | " + message)
	os.Exit(1)
}
