package server

import (
	"encoding/json"
	"net/http"

	"github.com/axie22/turtl/backend/internal/auth"
)

func (s *Server) RegisterRoutes() http.Handler {
	mux := http.NewServeMux()

	// Services
	authService := auth.NewService(s.cfg)
	authHandler := auth.NewHandler(authService)

	// Routes
	mux.HandleFunc("/health", s.healthHandler)
	mux.HandleFunc("/auth/login", authHandler.HandleLogin)

	// Protected routes example
	// mux.Handle("/api/protected", authService.Middleware(http.HandlerFunc(protectedHandler)))

	return mux
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, _ := json.Marshal(map[string]string{
		"status": "healthy",
	})
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResp)
}
