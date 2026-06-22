package addon

type TagItem struct {
	Name string `yaml:"name" json:"name"`
	Text string `yaml:"text" json:"text"`
}

type FileTagGroup struct {
	File string    `json:"file"`
	Tags []TagItem `json:"tags"`
}

type AddonCategory struct {
	ID       int       `yaml:"id" json:"id"`
	Category string    `yaml:"category" json:"category"`
	Tags     []TagItem `yaml:"tags,omitempty" json:"tags,omitempty"`
	Files    []string  `yaml:"files,omitempty" json:"files,omitempty"`
}

type AddonInfo struct {
	Name        string          `yaml:"name" json:"name"`
	Description string          `yaml:"description,omitempty" json:"description"`
	Version     string          `yaml:"version,omitempty" json:"version"`
	Author      string          `yaml:"author,omitempty" json:"author"`
	Icon        string          `yaml:"icon,omitempty" json:"icon"`
	Categories  []AddonCategory `yaml:"categories" json:"categories"`
}

type Addon struct {
	Info     AddonInfo                   `json:"info"`
	Dir      string                      `json:"dir"`
	TagFiles map[string][]FileTagGroup   `json:"tagFiles"`
}
