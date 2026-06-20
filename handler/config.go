package handler

import (
	"encoding/json"
	"net/http"

	"design-prompt/config"
)

func handleConfig(cfg *config.Config, configPath string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			jsonOK(w, cfg)

		case http.MethodPut:
			var updated config.Config
			if err := json.NewDecoder(r.Body).Decode(&updated); err != nil {
				jsonError(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
				return
			}
			if updated.Port <= 0 {
				updated.Port = 8080
			}
			if updated.TagsPath == "" {
				updated.TagsPath = "./tags"
			}
			if updated.DBPath == "" {
				updated.DBPath = "./data.db"
			}
			if updated.LogsDir == "" {
				updated.LogsDir = "./logs"
			}
			if updated.LogLevel == "" {
				updated.LogLevel = "error"
			}
			if updated.ComfyAddress == "" {
				updated.ComfyAddress = "http://127.0.0.1:8188"
			}
			if updated.SavePath == "" {
				updated.SavePath = "./output"
			}
			if updated.Resolutions == "" {
				updated.Resolutions = cfg.Resolutions
			}
			updated.WorkflowsPath = cfg.WorkflowsPath

			if err := updated.Save(configPath); err != nil {
				jsonError(w, "Save failed: "+err.Error(), http.StatusInternalServerError)
				return
			}
			*cfg = updated

			jsonOK(w, map[string]string{"status": "ok"})

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
