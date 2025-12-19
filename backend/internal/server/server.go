package server

import (
	"fmt"
	"net/http"
	"time"

	"github.com/axie22/turtl/backend/internal/config"
)

type Server struct {
	port string
	cfg  *config.Config
}

func NewServer(cfg *config.Config) *http.Server {
	NewServer := &Server{
		port: cfg.Port,
		cfg:  cfg,
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%s", NewServer.port),
		Handler:      NewServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}
