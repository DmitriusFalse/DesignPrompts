package database

import (
	"database/sql"
	"encoding/json"
	"time"
)

type Repo struct {
	db *sql.DB
}

func NewRepo(db *sql.DB) *Repo {
	return &Repo{db: db}
}

func (r *Repo) now() string {
	return time.Now().UTC().Format(time.RFC3339)
}

func jsonString(v interface{}) string {
	b, _ := json.Marshal(v)
	return string(b)
}

const (
	promptColumns = "id, name, positive_text, negative_text, is_favorite, created_at, gen_data, chips_data"
	presetColumns = "id, name, positive_tags, negative_tags"
	customColumns    = "id, tag_name, full_text, block_id, structures, created_at"
	groupColumns     = "id, block_id, name, structures, created_at"
	aiTypeColumns    = "id, name, categories, enabled, sort_order, separator, created_at, updated_at"
)

type scanner interface{ Scan(dest ...interface{}) error }

func scanPrompt(row scanner, p *SavedPrompt) error {
	var fav int
	err := row.Scan(&p.ID, &p.Name, &p.PositiveText, &p.NegativeText, &fav, &p.CreatedAt, &p.GenData, &p.ChipsData)
	p.IsFavorite = fav == 1
	return err
}

func scanCustomTag(row scanner) (CustomMainTag, error) {
	var t CustomMainTag
	var structuresStr, subcat string
	err := row.Scan(&t.ID, &t.TagName, &t.FullText, &t.BlockID, &structuresStr, &t.CreatedAt, &subcat)
	if err == nil && structuresStr != "" {
		json.Unmarshal([]byte(structuresStr), &t.Structures)
	}
	if t.Structures == nil {
		t.Structures = []string{}
	}
	t.Subcategory = subcat
	return t, err
}

func scanMainTagGroup(row scanner) (MainTagGroup, error) {
	var g MainTagGroup
	var structuresStr string
	err := row.Scan(&g.ID, &g.BlockID, &g.Name, &structuresStr, &g.CreatedAt)
	if err == nil && structuresStr != "" {
		json.Unmarshal([]byte(structuresStr), &g.Structures)
	}
	if g.Structures == nil {
		g.Structures = []string{}
	}
	return g, err
}

// ─── Saved Prompts ───

func (r *Repo) SavePrompt(name, positiveText, negativeText string, isFavorite bool, genData, chipsData string) (*SavedPrompt, error) {
	fav := 0
	if isFavorite {
		fav = 1
	}
	now := r.now()
	res, err := r.db.Exec(`
		INSERT INTO saved_prompts (name, positive_text, negative_text, is_favorite, created_at, gen_data, chips_data)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`, name, positiveText, negativeText, fav, now, genData, chipsData)
	if err != nil {
		return nil, err
	}
	id, _ := res.LastInsertId()
	return &SavedPrompt{
		ID:           int(id),
		Name:         name,
		PositiveText: positiveText,
		NegativeText: negativeText,
		IsFavorite:   isFavorite,
		CreatedAt:    now,
		GenData:      genData,
		ChipsData:    chipsData,
	}, nil
}

func (r *Repo) GetHistory(limit int) ([]SavedPrompt, error) {
	if limit <= 0 {
		limit = 50
	}
	rows, err := r.db.Query(`SELECT `+promptColumns+` FROM saved_prompts WHERE is_favorite = 0 ORDER BY created_at DESC LIMIT ?`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var prompts []SavedPrompt
	for rows.Next() {
		var p SavedPrompt
		if err := scanPrompt(rows, &p); err != nil {
			return nil, err
		}
		prompts = append(prompts, p)
	}
	return prompts, rows.Err()
}

func (r *Repo) GetAllSavedPrompts() ([]SavedPrompt, error) {
	rows, err := r.db.Query(`SELECT ` + promptColumns + ` FROM saved_prompts ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var prompts []SavedPrompt
	for rows.Next() {
		var p SavedPrompt
		if err := scanPrompt(rows, &p); err != nil {
			return nil, err
		}
		prompts = append(prompts, p)
	}
	return prompts, rows.Err()
}

func (r *Repo) TrimHistory(max int) error {
	if max <= 0 {
		max = 50
	}
	_, err := r.db.Exec(`
		DELETE FROM saved_prompts
		WHERE id IN (
			SELECT id FROM saved_prompts
			WHERE is_favorite = 0
			ORDER BY created_at DESC
			LIMIT -1 OFFSET ?
		)
	`, max)
	return err
}

func (r *Repo) DeletePrompt(id int) error {
	_, err := r.db.Exec(`DELETE FROM saved_prompts WHERE id = ?`, id)
	return err
}

func (r *Repo) UpdatePrompt(id int, name, positiveText, negativeText, chipsData, genData string) error {
	_, err := r.db.Exec(`
		UPDATE saved_prompts SET name=?, positive_text=?, negative_text=?, chips_data=?, gen_data=? WHERE id=?
	`, name, positiveText, negativeText, chipsData, genData, id)
	return err
}

func (r *Repo) UpdatePromptName(id int, name string) error {
	_, err := r.db.Exec(`UPDATE saved_prompts SET name=? WHERE id=?`, name, id)
	return err
}

// ─── Tag Presets ───

func (r *Repo) GetPresets() ([]TagPreset, error) {
	rows, err := r.db.Query(`SELECT ` + presetColumns + ` FROM tag_presets ORDER BY name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var presets []TagPreset
	for rows.Next() {
		var p TagPreset
		if err := rows.Scan(&p.ID, &p.Name, &p.PositiveTags, &p.NegativeTags); err != nil {
			return nil, err
		}
		presets = append(presets, p)
	}
	return presets, rows.Err()
}

func (r *Repo) SavePreset(name string, positiveTags, negativeTags []string) (*TagPreset, error) {
	res, err := r.db.Exec(`
		INSERT INTO tag_presets (name, positive_tags, negative_tags)
		VALUES (?, ?, ?)
		ON CONFLICT(name) DO UPDATE SET
			positive_tags = excluded.positive_tags,
			negative_tags = excluded.negative_tags
	`, name, jsonString(positiveTags), jsonString(negativeTags))
	if err != nil {
		return nil, err
	}
	id, _ := res.LastInsertId()
	return &TagPreset{
		ID:           int(id),
		Name:         name,
		PositiveTags: jsonString(positiveTags),
		NegativeTags: jsonString(negativeTags),
	}, nil
}

func (r *Repo) DeletePreset(id int) error {
	_, err := r.db.Exec(`DELETE FROM tag_presets WHERE id = ?`, id)
	return err
}

// ─── Custom Main Tags ───

func (r *Repo) SaveCustomMainTag(tagName, fullText string, blockID int, subcategory string, structures []string) (*CustomMainTag, error) {
	now := r.now()
	res, err := r.db.Exec(`
		INSERT INTO custom_main_tags (tag_name, full_text, block_id, structures, subcategory, created_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`, tagName, fullText, blockID, jsonString(structures), subcategory, now)
	if err != nil {
		return nil, err
	}
	id, _ := res.LastInsertId()
	return &CustomMainTag{
		ID:          int(id),
		TagName:     tagName,
		FullText:    fullText,
		BlockID:     blockID,
		Subcategory: subcategory,
		Structures:  structures,
		CreatedAt:   now,
	}, nil
}

func (r *Repo) UpdateCustomMainTag(id int, tagName, fullText string, blockID int, subcategory string, structures []string) error {
	_, err := r.db.Exec(`
		UPDATE custom_main_tags SET tag_name=?, full_text=?, block_id=?, structures=?, subcategory=? WHERE id=?
	`, tagName, fullText, blockID, jsonString(structures), subcategory, id)
	return err
}

func (r *Repo) GetCustomMainTags() ([]CustomMainTag, error) {
	rows, err := r.db.Query(`SELECT ` + customColumns + `, subcategory FROM custom_main_tags ORDER BY created_at`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tags []CustomMainTag
	for rows.Next() {
		t, err := scanCustomTag(rows)
		if err != nil {
			return nil, err
		}
		tags = append(tags, t)
	}
	return tags, rows.Err()
}

func (r *Repo) DeleteCustomMainTag(id int) error {
	_, err := r.db.Exec(`DELETE FROM custom_main_tags WHERE id = ?`, id)
	return err
}

// ─── Main Tag Groups ───

func (r *Repo) SaveMainTagGroup(blockID int, name string, structures []string) (*MainTagGroup, error) {
	now := r.now()
	res, err := r.db.Exec(`INSERT INTO main_tag_groups (block_id, name, structures, created_at) VALUES (?, ?, ?, ?)`, blockID, name, jsonString(structures), now)
	if err != nil {
		return nil, err
	}
	id, _ := res.LastInsertId()
	return &MainTagGroup{ID: int(id), BlockID: blockID, Name: name, Structures: structures, CreatedAt: now}, nil
}

func (r *Repo) GetAllMainTagGroups() ([]MainTagGroup, error) {
	rows, err := r.db.Query(`SELECT ` + groupColumns + ` FROM main_tag_groups ORDER BY name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var groups []MainTagGroup
	for rows.Next() {
		g, err := scanMainTagGroup(rows)
		if err != nil {
			return nil, err
		}
		groups = append(groups, g)
	}
	return groups, rows.Err()
}

func (r *Repo) GetMainTagGroupsByBlock(blockID int) ([]MainTagGroup, error) {
	rows, err := r.db.Query(`SELECT `+groupColumns+` FROM main_tag_groups WHERE block_id = ? ORDER BY name`, blockID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var groups []MainTagGroup
	for rows.Next() {
		g, err := scanMainTagGroup(rows)
		if err != nil {
			return nil, err
		}
		groups = append(groups, g)
	}
	return groups, rows.Err()
}

func (r *Repo) DeleteMainTagGroup(id int) error {
	_, err := r.db.Exec(`DELETE FROM main_tag_groups WHERE id = ?`, id)
	return err
}

// ─── Ai Types ───

func (r *Repo) GetAllAiTypes() ([]AiType, error) {
	rows, err := r.db.Query(`SELECT ` + aiTypeColumns + ` FROM ai_types ORDER BY sort_order`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var types []AiType
	for rows.Next() {
		var t AiType
		var enabled int
		err := rows.Scan(&t.ID, &t.Name, &t.Categories, &enabled, &t.SortOrder, &t.Separator, &t.CreatedAt, &t.UpdatedAt)
		if err != nil {
			return nil, err
		}
		t.Enabled = enabled == 1
		types = append(types, t)
	}
	return types, rows.Err()
}

func (r *Repo) CreateAiType(name, categories string, enabled bool, sortOrder int, separator string) (*AiType, error) {
	en := 0
	if enabled {
		en = 1
	}
	now := r.now()
	res, err := r.db.Exec(`INSERT INTO ai_types (name, categories, enabled, sort_order, separator, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		name, categories, en, sortOrder, separator, now, now)
	if err != nil {
		return nil, err
	}
	id, _ := res.LastInsertId()
	return &AiType{ID: int(id), Name: name, Categories: categories, Enabled: enabled, SortOrder: sortOrder, Separator: separator, CreatedAt: now, UpdatedAt: now}, nil
}

func (r *Repo) UpdateAiType(id int, name, categories string, enabled bool, sortOrder int, separator string) error {
	en := 0
	if enabled {
		en = 1
	}
	now := r.now()
	_, err := r.db.Exec(`UPDATE ai_types SET name=?, categories=?, enabled=?, sort_order=?, separator=?, updated_at=? WHERE id=?`,
		name, categories, en, sortOrder, separator, now, id)
	return err
}

func (r *Repo) DeleteAiType(id int) error {
	_, err := r.db.Exec(`DELETE FROM ai_types WHERE id = ?`, id)
	return err
}

// ─── Seed ───

func (r *Repo) SeedDefaultPreset() error {
	var count int
	r.db.QueryRow(`SELECT COUNT(*) FROM tag_presets WHERE name = 'Quality Only'`).Scan(&count)
	if count > 0 {
		return nil
	}

	positive := []string{"score_9", "score_8_up", "score_7_up", "score_6_up", "score_5_up", "BREAK", "best_quality", "high_quality", "high_res", "masterpiece", "detailed"}
	negative := []string{"low_quality", "worst_quality", "bad_art"}

	_, err := r.SavePreset("Quality Only", positive, negative)
	return err
}
