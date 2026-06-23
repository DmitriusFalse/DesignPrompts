package handler

import (
	"database/sql"
	"net/http"
	"path/filepath"

	"design-prompt/addon"
	"design-prompt/config"
	"design-prompt/database"
)

func RegisterRoutes(mux *http.ServeMux, db *sql.DB, cfg *config.Config, configPath string, addons []*addon.Addon) {
	repo := database.NewRepo(db)
	cfg.WorkflowsPath = filepath.Join(filepath.Dir(configPath), "Workflows")

	mux.Handle("/static/", http.StripPrefix("/static/", StaticHandler()))

	mux.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/static/icon.ico", http.StatusMovedPermanently)
	})
	mux.HandleFunc("/sw.js", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Service-Worker-Allowed", "/")
		serveEmbedded(w, r, "/sw.js")
	})
	mux.HandleFunc("/", handleIndex())
	mux.HandleFunc("/settings", handleSettingsPage())

	api := func(h http.HandlerFunc) http.HandlerFunc {
		return apiMiddleware(h)
	}

	mux.HandleFunc("/api/config", api(handleConfig(cfg, configPath)))
	mux.HandleFunc("/api/custom-main-tags", api(handleCustomMainTags(repo)))
	mux.HandleFunc("/api/main-tag-groups", api(handleMainTagGroups(repo)))
	mux.HandleFunc("/api/addons", api(handleAddons(addons)))
	mux.HandleFunc("/api/addon/icon", api(handleAddonIcon(addons)))
	mux.HandleFunc("/api/addon/tags", api(handleAddonTagsList(addons)))
	mux.HandleFunc("/api/presets", api(handlePresets(repo)))
	mux.HandleFunc("/api/prompts", api(handlePrompts(repo)))
	mux.HandleFunc("/api/comfy/workflows", api(handleComfyWorkflows(cfg)))
	mux.HandleFunc("/api/comfy/generate", api(handleComfyGenerate(cfg)))
	mux.HandleFunc("/api/comfy/image", api(handleComfyImage(cfg)))
	mux.HandleFunc("/api/comfy/object_info/", api(handleComfyObjectInfo(cfg)))
	mux.HandleFunc("/api/comfy/save-image", api(handleComfySaveImage(cfg)))
	mux.HandleFunc("/api/comfy/prompt-info", api(handleComfyPromptInfo(cfg)))
	mux.HandleFunc("/api/comfy/scan-history", api(handleComfyScanHistory(cfg)))
	mux.HandleFunc("/api/comfy/ws", api(handleComfyWS(cfg)))
	mux.HandleFunc("/api/open-url", api(handleOpenURL()))
}
