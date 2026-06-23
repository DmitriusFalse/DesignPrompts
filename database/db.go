package database

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

var migrations = []string{
	`CREATE TABLE IF NOT EXISTS saved_prompts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL DEFAULT '',
		positive_text TEXT NOT NULL DEFAULT '',
		negative_text TEXT NOT NULL DEFAULT '',
		is_favorite INTEGER NOT NULL DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`,
	`CREATE TABLE IF NOT EXISTS tag_presets (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL UNIQUE,
		positive_tags TEXT NOT NULL DEFAULT '[]',
		negative_tags TEXT NOT NULL DEFAULT '[]'
	)`,
	`CREATE TABLE IF NOT EXISTS ai_types (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		categories TEXT NOT NULL DEFAULT '',
		enabled INTEGER NOT NULL DEFAULT 1,
		sort_order INTEGER NOT NULL DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`,
	`CREATE TABLE IF NOT EXISTS custom_main_tags (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		tag_name TEXT NOT NULL,
		full_text TEXT DEFAULT '',
		block_id INTEGER NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`,
}

func columnExists(db *sql.DB, table, column string) (bool, error) {
	rows, err := db.Query(fmt.Sprintf("PRAGMA table_info(%s)", table))
	if err != nil {
		return false, err
	}
	defer rows.Close()
	for rows.Next() {
		var cid int
		var name, ctype string
		var notnull sql.NullInt64
		var dfltValue sql.NullString
		var pk int
		if err := rows.Scan(&cid, &name, &ctype, &notnull, &dfltValue, &pk); err != nil {
			return false, err
		}
		if name == column {
			return true, nil
		}
	}
	return false, rows.Err()
}

func addColumnIfNotExists(db *sql.DB, table, column, colDef string) error {
	exists, err := columnExists(db, table, column)
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	_, err = db.Exec(fmt.Sprintf("ALTER TABLE %s ADD COLUMN %s", table, colDef))
	return err
}

func dropColumnIfExists(db *sql.DB, table, column string) error {
	exists, err := columnExists(db, table, column)
	if err != nil {
		return err
	}
	if !exists {
		return nil
	}
	_, err = db.Exec(fmt.Sprintf("ALTER TABLE %s DROP COLUMN %s", table, column))
	return err
}

type oldCategoryItem struct {
	Name  string `json:"name"`
	Tags  string `json:"tags"`
	Order int    `json:"order"`
}

func convertOldCategories(db *sql.DB) error {
	rows, err := db.Query(`SELECT id, categories FROM ai_types WHERE categories != '' AND categories NOT LIKE '[%'`)
	if err != nil {
		return err
	}
	defer rows.Close()
	for rows.Next() {
		var id int
		var cats string
		if err := rows.Scan(&id, &cats); err != nil {
			return err
		}
		lines := strings.Split(cats, "\n")
		var items []oldCategoryItem
		for i, line := range lines {
			line = strings.TrimSpace(line)
			if line == "" {
				continue
			}
			items = append(items, oldCategoryItem{Name: line, Tags: "", Order: i})
		}
		if items == nil {
			items = []oldCategoryItem{}
		}
		b, _ := json.Marshal(items)
		if _, err := db.Exec(`UPDATE ai_types SET categories = ? WHERE id = ?`, string(b), id); err != nil {
			return err
		}
	}
	return rows.Err()
}

func Init(dbPath string) (*sql.DB, error) {
	db, err := sql.Open("sqlite3", dbPath+"?_journal_mode=WAL&_foreign_keys=on")
	if err != nil {
		return nil, fmt.Errorf("open db: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("ping db: %w", err)
	}

	for _, m := range migrations {
		if _, err := db.Exec(m); err != nil {
			return nil, fmt.Errorf("migration: %w", err)
		}
	}

	if err := addColumnIfNotExists(db, "saved_prompts", "gen_data", "gen_data TEXT NOT NULL DEFAULT ''"); err != nil {
		return nil, fmt.Errorf("migration: %w", err)
	}
	if err := addColumnIfNotExists(db, "saved_prompts", "chips_data", "chips_data TEXT NOT NULL DEFAULT ''"); err != nil {
		return nil, fmt.Errorf("migration: %w", err)
	}
	if err := addColumnIfNotExists(db, "custom_main_tags", "structures", "structures TEXT NOT NULL DEFAULT '[]'"); err != nil {
		return nil, fmt.Errorf("migration: %w", err)
	}
	if err := addColumnIfNotExists(db, "custom_main_tags", "subcategory", "subcategory TEXT NOT NULL DEFAULT ''"); err != nil {
		return nil, fmt.Errorf("migration: %w", err)
	}
	if _, err := db.Exec(`CREATE TABLE IF NOT EXISTS main_tag_groups (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		block_id INTEGER NOT NULL,
		name TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`); err != nil {
		return nil, fmt.Errorf("migration: %w", err)
	}
	if err := addColumnIfNotExists(db, "main_tag_groups", "structures", "structures TEXT NOT NULL DEFAULT '[]'"); err != nil {
		return nil, fmt.Errorf("migration: %w", err)
	}
	if err := addColumnIfNotExists(db, "ai_types", "categories", "categories TEXT NOT NULL DEFAULT ''"); err != nil {
		return nil, fmt.Errorf("migration: %w", err)
	}
	if err := dropColumnIfExists(db, "ai_types", "structure_id"); err != nil {
		return nil, fmt.Errorf("drop structure_id: %w", err)
	}
	if err := addColumnIfNotExists(db, "ai_types", "separator", "separator TEXT NOT NULL DEFAULT ', '"); err != nil {
		return nil, fmt.Errorf("add separator: %w", err)
	}
	if err := convertOldCategories(db); err != nil {
		return nil, fmt.Errorf("convert categories: %w", err)
	}

	repo := NewRepo(db)
	if err := repo.SeedDefaultPreset(); err != nil {
		return nil, fmt.Errorf("seed presets: %w", err)
	}
	// Drop old pack tables
	for _, t := range []string{"tags", "files", "packs", "tree_cache"} {
		if _, err := db.Exec("DROP TABLE IF EXISTS " + t); err != nil {
			return nil, fmt.Errorf("drop old table %s: %w", t, err)
		}
	}

	return db, nil
}
