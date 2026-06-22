package addon

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

func ParseInfoPack(path string) (*AddonInfo, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("read info.pack: %w", err)
	}
	var info AddonInfo
	if err := yaml.Unmarshal(data, &info); err != nil {
		return nil, fmt.Errorf("parse info.pack: %w", err)
	}
	if strings.TrimSpace(info.Name) == "" {
		return nil, fmt.Errorf("info.pack: name is required")
	}
	seen := make(map[int]bool)
	for _, c := range info.Categories {
		if seen[c.ID] {
			return nil, fmt.Errorf("info.pack: duplicate category id %d", c.ID)
		}
		seen[c.ID] = true
	}
	return &info, nil
}

func ParseTagsFile(path string) ([]TagItem, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	lines := strings.Split(string(data), "\n")
	var items []TagItem
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		var item TagItem
		if idx := strings.Index(line, " | "); idx != -1 {
			item.Name = strings.TrimSpace(line[:idx])
			item.Text = strings.TrimSpace(line[idx+3:])
		} else {
			item.Name = line
			item.Text = line
		}
		items = append(items, item)
	}
	return items, nil
}

func LoadAddon(dir string) (*Addon, error) {
	infoPath := filepath.Join(dir, "info.pack")
	info, err := ParseInfoPack(infoPath)
	if err != nil {
		return nil, err
	}
	addon := &Addon{
		Info:     *info,
		Dir:      dir,
		TagFiles: make(map[string][]FileTagGroup),
	}
	for _, cat := range info.Categories {
		if len(cat.Files) > 0 {
			var groups []FileTagGroup
			for _, f := range cat.Files {
				tagsPath := filepath.Join(dir, f)
				tags, err := ParseTagsFile(tagsPath)
				if err != nil {
					return nil, fmt.Errorf("load tags for category %q file %q: %w", cat.Category, f, err)
				}
				groups = append(groups, FileTagGroup{File: f, Tags: tags})
			}
			addon.TagFiles[cat.Category] = groups
		} else if len(cat.Tags) > 0 {
			addon.TagFiles[cat.Category] = []FileTagGroup{{File: "", Tags: cat.Tags}}
		}
	}
	return addon, nil
}
