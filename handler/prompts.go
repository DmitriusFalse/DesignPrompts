package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"danbooru-prompt-builder/database"
)

func handlePrompts(repo *database.Repo) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			prompts, err := repo.GetAllSavedPrompts()
			if err != nil {
				jsonError(w, err.Error(), http.StatusInternalServerError)
				return
			}
			if prompts == nil {
				prompts = []database.SavedPrompt{}
			}
			jsonOK(w, prompts)

		case http.MethodPost:
			var body struct {
				ID           int    `json:"id"`
				Name         string `json:"name"`
				PositiveText string `json:"positive_text"`
				NegativeText string `json:"negative_text"`
				ChipsData    string `json:"chips_data"`
			}
			if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
				jsonError(w, "invalid body", http.StatusBadRequest)
				return
			}
			if strings.TrimSpace(body.Name) == "" {
				jsonError(w, "name is required", http.StatusBadRequest)
				return
			}
			name := strings.TrimSpace(body.Name)
			if body.ID > 0 {
				if err := repo.UpdatePrompt(body.ID, name, body.PositiveText, body.NegativeText, body.ChipsData); err != nil {
					jsonError(w, err.Error(), http.StatusInternalServerError)
					return
				}
				jsonOK(w, map[string]interface{}{
					"id": body.ID, "name": name, "positive_text": body.PositiveText,
					"negative_text": body.NegativeText, "chips_data": body.ChipsData,
				})
			} else {
				prompt, err := repo.SavePrompt(
					name,
					body.PositiveText,
					body.NegativeText,
					true,
					"",
					body.ChipsData,
				)
				if err != nil {
					jsonError(w, err.Error(), http.StatusInternalServerError)
					return
				}
				jsonCreated(w, prompt)
			}

		case http.MethodDelete:
			idStr := r.URL.Query().Get("id")
			id, _ := strconv.Atoi(idStr)
			if id <= 0 {
				jsonError(w, "id required", http.StatusBadRequest)
				return
			}
			if err := repo.DeletePrompt(id); err != nil {
				jsonError(w, err.Error(), http.StatusInternalServerError)
				return
			}
			jsonOK(w, map[string]string{"status": "ok"})

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
