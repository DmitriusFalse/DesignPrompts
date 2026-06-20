package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"danbooru-prompt-builder/database"
)

func handleCustomMainTags(repo *database.Repo) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			tags, err := repo.GetCustomMainTags()
			if err != nil {
				jsonError(w, err.Error(), http.StatusInternalServerError)
				return
			}
			if tags == nil {
				tags = []database.CustomMainTag{}
			}
			jsonOK(w, tags)

		case http.MethodPost:
			var body struct {
				ID          int      `json:"id"`
				TagName     string   `json:"tag_name"`
				FullText    string   `json:"full_text"`
				BlockID     int      `json:"block_id"`
				Subcategory string   `json:"subcategory"`
				Structures  []string `json:"structures"`
			}
			if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
				jsonError(w, "invalid body", http.StatusBadRequest)
				return
			}
			if strings.TrimSpace(body.TagName) == "" {
				jsonError(w, "tag_name is required", http.StatusBadRequest)
				return
			}
			if body.Structures == nil {
				body.Structures = []string{}
			}
			if body.ID > 0 {
				if err := repo.UpdateCustomMainTag(body.ID, strings.TrimSpace(body.TagName), body.FullText, body.BlockID, body.Subcategory, body.Structures); err != nil {
					jsonError(w, err.Error(), http.StatusInternalServerError)
					return
				}
				jsonOK(w, map[string]interface{}{"id": body.ID, "status": "updated"})
			} else {
				tag, err := repo.SaveCustomMainTag(strings.TrimSpace(body.TagName), body.FullText, body.BlockID, body.Subcategory, body.Structures)
				if err != nil {
					jsonError(w, err.Error(), http.StatusInternalServerError)
					return
				}
				jsonCreated(w, tag)
			}

		case http.MethodDelete:
			idStr := r.URL.Query().Get("id")
			id, _ := strconv.Atoi(idStr)
			if id <= 0 {
				jsonError(w, "id required", http.StatusBadRequest)
				return
			}
			if err := repo.DeleteCustomMainTag(id); err != nil {
				jsonError(w, err.Error(), http.StatusInternalServerError)
				return
			}
			jsonOK(w, map[string]string{"status": "ok"})

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
