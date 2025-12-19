package main

import (
	"fmt"
	"log"

	"github.com/axie22/turtl/backend/internal/config"
	"github.com/axie22/turtl/backend/internal/server"
)

func main() {
	cfg := config.LoadConfig()

	server := server.NewServer(cfg)

	fmt.Printf("Server starting on port %s\n", cfg.Port)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("cannot start server: %s", err)
	}
}
