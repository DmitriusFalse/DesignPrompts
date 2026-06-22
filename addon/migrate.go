package addon

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"design-prompt/database"

	"gopkg.in/yaml.v3"
)

type catJSON struct {
	Name  string `json:"name"`
	Order int    `json:"order"`
}

var aiTypeToAddon = map[string]string{
	"Стандартный":      "Standard",
	"NovelAI/Pony":     "NovelAI-Pony",
	"Stable Diffusion": "Stable-Diffusion",
	"DALL-E 3":         "DALL-E-3",
	"Аниме":            "Anime",
}

func addonDirName(name string) string {
	if n, ok := aiTypeToAddon[name]; ok {
		return n
	}
	s := strings.ReplaceAll(name, "/", "-")
	s = strings.ReplaceAll(s, " ", "-")
	return s
}

func MigrateFromTags(addonsPath string) error {
	// Skip if addonsDir already has addons
	if entries, err := os.ReadDir(addonsPath); err == nil {
		for _, e := range entries {
			if e.IsDir() {
				infoPath := filepath.Join(addonsPath, e.Name(), "info.pack")
				if _, err := os.Stat(infoPath); err == nil {
					return nil
				}
			}
		}
	}

	if err := os.MkdirAll(addonsPath, 0755); err != nil {
		return fmt.Errorf("create addons dir: %w", err)
	}

	// Generate addons from AI templates (Standard, Flux, NovelAI-Pony, Anime, Stable-Diffusion, DALL-E-3, Midjourney)
	seeds := database.DefaultAiTypeSeeds()
	for _, s := range seeds {
		dirName := addonDirName(s.Name)
		dest := filepath.Join(addonsPath, dirName)
		if err := os.MkdirAll(dest, 0755); err != nil {
			fmt.Fprintf(os.Stderr, "create addon dir %q: %v\n", dirName, err)
			continue
		}
		infoPath := filepath.Join(dest, "info.pack")
		if _, err := os.Stat(infoPath); err == nil {
			continue
		}
		var cats []catJSON
		if err := json.Unmarshal([]byte(s.Categories), &cats); err != nil {
			fmt.Fprintf(os.Stderr, "parse categories for %q: %v\n", s.Name, err)
			continue
		}
		var addonCats []AddonCategory
		for _, c := range cats {
			addonCats = append(addonCats, AddonCategory{
				ID:       c.Order + 1,
				Category: c.Name,
			})
		}
		info := AddonInfo{
			Name:       addonDirName(s.Name),
			Version:    "1.0",
			Categories: addonCats,
		}
		data, err := yaml.Marshal(&info)
		if err != nil {
			fmt.Fprintf(os.Stderr, "marshal addon %q: %v\n", dirName, err)
			continue
		}
		if err := os.WriteFile(infoPath, data, 0644); err != nil {
			fmt.Fprintf(os.Stderr, "write %q: %v\n", infoPath, err)
		}
	}

	return nil
}
