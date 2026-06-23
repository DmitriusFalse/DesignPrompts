package database

type SavedPrompt struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	PositiveText string `json:"positive_text"`
	NegativeText string `json:"negative_text"`
	IsFavorite   bool   `json:"is_favorite"`
	CreatedAt    string `json:"created_at"`
	GenData      string `json:"gen_data"`
	ChipsData    string `json:"chips_data"`
}

type TagPreset struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	PositiveTags string `json:"positive_tags"`
	NegativeTags string `json:"negative_tags"`
}

type MainTagGroup struct {
	ID         int      `json:"id"`
	BlockID    int      `json:"block_id"`
	Name       string   `json:"name"`
	Structures []string `json:"structures"`
	CreatedAt  string   `json:"created_at"`
}

type CustomMainTag struct {
	ID          int      `json:"id"`
	TagName     string   `json:"tag_name"`
	FullText    string   `json:"full_text"`
	BlockID     int      `json:"block_id"`
	Subcategory string   `json:"subcategory"`
	Structures  []string `json:"structures"`
	CreatedAt   string   `json:"created_at"`
}
