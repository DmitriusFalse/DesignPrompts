package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"design-prompt/database"
)

func handleMainTagGroups(repo *database.Repo) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			blockIDStr := r.URL.Query().Get("block_id")
			if blockIDStr != "" {
				blockID, _ := strconv.Atoi(blockIDStr)
				groups, err := repo.GetMainTagGroupsByBlock(blockID)
				if err != nil {
					jsonError(w, err.Error(), http.StatusInternalServerError)
					return
				}
				if groups == nil {
					groups = []database.MainTagGroup{}
				}
				jsonOK(w, groups)
			} else {
				groups, err := repo.GetAllMainTagGroups()
				if err != nil {
					jsonError(w, err.Error(), http.StatusInternalServerError)
					return
				}
				if groups == nil {
					groups = []database.MainTagGroup{}
				}
				jsonOK(w, groups)
			}

		case http.MethodPost:
			var body struct {
				BlockID    int      `json:"block_id"`
				Name       string   `json:"name"`
				Structures []string `json:"structures"`
			}
			if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
				jsonError(w, "invalid body", http.StatusBadRequest)
				return
			}
			if body.Name == "" {
				jsonError(w, "name is required", http.StatusBadRequest)
				return
			}
			if body.Structures == nil {
				body.Structures = []string{}
			}
			group, err := repo.SaveMainTagGroup(body.BlockID, body.Name, body.Structures)
			if err != nil {
				jsonError(w, err.Error(), http.StatusInternalServerError)
				return
			}
			jsonCreated(w, group)

		case http.MethodDelete:
			idStr := r.URL.Query().Get("id")
			id, _ := strconv.Atoi(idStr)
			if id <= 0 {
				jsonError(w, "id required", http.StatusBadRequest)
				return
			}
			if err := repo.DeleteMainTagGroup(id); err != nil {
				jsonError(w, err.Error(), http.StatusInternalServerError)
				return
			}
			jsonOK(w, map[string]string{"status": "ok"})

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
