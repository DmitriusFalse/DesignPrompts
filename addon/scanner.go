package addon

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

func ScanAddons(addonsPath string) ([]*Addon, error) {
	entries, err := os.ReadDir(addonsPath)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("read addons dir: %w", err)
	}
	var addons []*Addon
	seen := make(map[string]bool)
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		dir := filepath.Join(addonsPath, entry.Name())
		infoPath := filepath.Join(dir, "info.pack")
		if _, err := os.Stat(infoPath); os.IsNotExist(err) {
			continue
		}
		a, err := LoadAddon(dir)
		if err != nil {
			fmt.Fprintf(os.Stderr, "addon %q: %v\n", entry.Name(), err)
			continue
		}
		name := strings.TrimSpace(a.Info.Name)
		if seen[name] {
			fmt.Fprintf(os.Stderr, "addon %q: duplicate name %q, skipping\n", entry.Name(), name)
			continue
		}
		seen[name] = true
		addons = append(addons, a)
	}
	sort.Slice(addons, func(i, j int) bool {
		return addons[i].Info.Name < addons[j].Info.Name
	})
	return addons, nil
}
