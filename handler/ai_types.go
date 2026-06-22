package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"design-prompt/database"
)

func handleAiTypes(repo *database.Repo) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			types, err := repo.GetAllAiTypes()
			if err != nil {
				jsonError(w, err.Error(), http.StatusInternalServerError)
				return
			}
			if types == nil {
				types = []database.AiType{}
			}
			jsonOK(w, types)

		case http.MethodPost:
			var body struct {
				ID         int    `json:"id"`
				Name       string `json:"name"`
				Categories string `json:"categories"`
				Enabled    bool   `json:"enabled"`
				SortOrder  int    `json:"sort_order"`
				Separator  string `json:"separator"`
			}
			if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
				jsonError(w, "invalid body", http.StatusBadRequest)
				return
			}
			if strings.TrimSpace(body.Name) == "" {
				jsonError(w, "name is required", http.StatusBadRequest)
				return
			}
			if body.Separator == "" {
				body.Separator = ", "
			}
			if body.ID > 0 {
				if err := repo.UpdateAiType(body.ID, strings.TrimSpace(body.Name), body.Categories, body.Enabled, body.SortOrder, body.Separator); err != nil {
					jsonError(w, err.Error(), http.StatusInternalServerError)
					return
				}
				jsonOK(w, map[string]interface{}{
					"id": body.ID, "name": body.Name,
					"categories": body.Categories, "enabled": body.Enabled, "sort_order": body.SortOrder, "separator": body.Separator,
				})
			} else {
				at, err := repo.CreateAiType(strings.TrimSpace(body.Name), body.Categories, body.Enabled, body.SortOrder, body.Separator)
				if err != nil {
					jsonError(w, err.Error(), http.StatusInternalServerError)
					return
				}
				jsonCreated(w, at)
			}

		case http.MethodDelete:
			idStr := r.URL.Query().Get("id")
			id, _ := strconv.Atoi(idStr)
			if id <= 0 {
				jsonError(w, "id required", http.StatusBadRequest)
				return
			}
			if err := repo.DeleteAiType(id); err != nil {
				jsonError(w, err.Error(), http.StatusInternalServerError)
				return
			}
			jsonOK(w, map[string]string{"status": "ok"})

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
