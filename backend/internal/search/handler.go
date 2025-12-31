package search

import (
	"encoding/json"
	"net/http"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) HandleSearch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Query parameter 'q' is required", http.StatusBadRequest)
		return
	}

	results, err := h.service.SearchFiles(query)
	if err != nil {
		http.Error(w, "Error searching files", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(SearchResponse{
		Results: results,
	})
}
