package copilot

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

type Handler struct{}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) HandleChat(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	aiResponses := []string{
		"The preclinical toxicology data suggests a potential signal in the hepatic panel. We should cross-reference this with the 21 CFR 312.23(a)(8) requirements for pharmacology and toxicology information.",
		"For the IND application, ensure the Investigator's Brochure (IB) is updated with the latest in vitro metabolic stability data.",
		"I've flagged a potential gap in the CMC (Chemistry, Manufacturing, and Controls) section regarding the stability protocol for the clinical batch.",
		"Based on the mechanism of action, we should anticipate FDA questions regarding off-target effects. I recommend conducting an additional safety pharmacology study.",
		"The protocol for the Phase 1 study needs to explicitly define the stopping rules for dose escalation as per FDA guidance on identifying safe starting doses.",
		"Remember to include the Form FDA 1571 and 1572 in Module 1 of the eCTD structure.",
		"Regarding 21 CFR Part 11.10(e), the key requirement is ensuring that the audit trail captures the exact timestamp of every record creation, modification, or deletion. Your system needs to prevent users from altering these timestamps.",
	}

	var responseContent string
	if strings.Contains(req.Message, "21 CFR Part 11.10(e)") {
		responseContent = aiResponses[6]
	} else {
		rand.Seed(time.Now().UnixNano())
		responseContent = aiResponses[rand.Intn(len(aiResponses)-1)]
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ChatResponse{
		Response: responseContent,
	})
}
