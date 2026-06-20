package handler

import (
	"net/http"

	"danbooru-prompt-builder/config"
	"danbooru-prompt-builder/sync"
)

func handleSync(syncSvc *sync.Service, cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		if err := syncSvc.Sync(cfg.TagsPath); err != nil {
			jsonError(w, "Sync failed: "+err.Error(), http.StatusInternalServerError)
			return
		}

		jsonOK(w, map[string]string{"status": "ok"})
	}
}
