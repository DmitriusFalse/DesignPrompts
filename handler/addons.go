package handler

import (
	"net/http"
	"os"
	"path/filepath"

	"design-prompt/addon"
)

func handleAddons(addons []*addon.Addon) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		name := r.URL.Query().Get("name")
		if name != "" {
			for _, a := range addons {
				if a.Info.Name == name {
					jsonOK(w, a)
					return
				}
			}
			jsonError(w, "addon not found", http.StatusNotFound)
			return
		}
		jsonOK(w, addons)
	}
}

func handleAddonIcon(addons []*addon.Addon) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		name := r.URL.Query().Get("name")
		if name == "" {
			jsonError(w, "name required", http.StatusBadRequest)
			return
		}
		for _, a := range addons {
			if a.Info.Name == name {
				iconName := a.Info.Icon
				if iconName == "" {
					// Try common icon filenames
					for _, try := range []string{"icon.png", "icon.jpg", "icon.webp", "icon.svg"} {
						p := filepath.Join(a.Dir, try)
						if fi, err := os.Stat(p); err == nil && !fi.IsDir() {
							iconName = try
							break
						}
					}
				}
				if iconName == "" {
					jsonError(w, "no icon", http.StatusNotFound)
					return
				}
				iconPath := filepath.Join(a.Dir, iconName)
				http.ServeFile(w, r, iconPath)
				return
			}
		}
		jsonError(w, "addon not found", http.StatusNotFound)
	}
}

func handleAddonTagsList(addons []*addon.Addon) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		name := r.URL.Query().Get("name")
		if name == "" {
			jsonError(w, "name required", http.StatusBadRequest)
			return
		}
		for _, a := range addons {
			if a.Info.Name == name {
				jsonOK(w, a.TagFiles)
				return
			}
		}
		jsonError(w, "addon not found", http.StatusNotFound)
	}
}
