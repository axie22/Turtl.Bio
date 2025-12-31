package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port       string
	AuthUser   string
	AuthPass   string
	AuthSecret string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	return &Config{
		Port:       getEnv("PORT", "8080"),
		AuthUser:   getEnv("ALPHA_AUTH_USER", "admin"),
		AuthPass:   getEnv("ALPHA_AUTH_PASSWORD", "biotech"),
		AuthSecret: getEnv("ALPHA_AUTH_SECRET", ""),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
