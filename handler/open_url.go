package handler

import (
	"net/http"
	"os/exec"
	"runtime"
)

func handleOpenURL() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		url := r.URL.Query().Get("url")
		if url == "" {
			http.Error(w, "url required", http.StatusBadRequest)
			return
		}
		var err error
		switch runtime.GOOS {
		case "windows":
			err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
		case "darwin":
			err = exec.Command("open", url).Start()
		default:
			err = exec.Command("xdg-open", url).Start()
		}
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}
