package handler

import (
	"encoding/json"
	"net/http"
)

func jsonResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func jsonOK(w http.ResponseWriter, data interface{}) {
	jsonResponse(w, http.StatusOK, data)
}

func jsonCreated(w http.ResponseWriter, data interface{}) {
	jsonResponse(w, http.StatusCreated, data)
}

func jsonError(w http.ResponseWriter, msg string, code int) {
	jsonResponse(w, code, map[string]string{"error": msg})
}
