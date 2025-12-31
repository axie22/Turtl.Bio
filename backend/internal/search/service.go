package search

import (
	"bufio"
	"os"
	"path/filepath"
	"strings"
)

type Service struct {
	// Root directory to search (relative to where the backend runs)
	RootDir string
}

func NewService() *Service {
	// Default to ../ to try and search project root
	rootDir := ".."

	// Safety check: resolve absolute path
	abs, err := filepath.Abs(rootDir)
	if err == nil && abs == "/" {
		// If ../ resolves to system root (typical in Docker at /app),
		// fallback to current directory to avoid scanning scanning /proc, /sys, etc.
		rootDir = "."
	}

	return &Service{
		RootDir: rootDir,
	}
}

func (s *Service) SearchFiles(query string) ([]SearchResult, error) {
	var results []SearchResult
	query = strings.ToLower(query)

	err := filepath.Walk(s.RootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil // Skip errors
		}

		if info.IsDir() {
			// Skip metadata and build artifacts
			if info.Name() == ".git" || info.Name() == "node_modules" || info.Name() == "dist" || info.Name() == "main-tmp" || info.Name() == ".next" {
				return filepath.SkipDir
			}
			// Skip potential system directories if we somehow got to root
			if info.Name() == "proc" || info.Name() == "sys" || info.Name() == "dev" || info.Name() == "etc" || info.Name() == "var" || info.Name() == "run" || info.Name() == "tmp" || info.Name() == "root" {
				return filepath.SkipDir
			}
			return nil
		}

		// Search filename first
		relPath, _ := filepath.Rel(s.RootDir, path)
		if strings.Contains(strings.ToLower(info.Name()), query) {
			results = append(results, SearchResult{
				FilePath: "/" + relPath, // Normalize for frontend
				Snippet:  "Filename match",
				LineNum:  0,
			})
			// Don't skip content search if filename matches?
			// Usually we want both, but let's just return file match for now or continue
		}

		// Search content
		file, err := os.Open(path)
		if err != nil {
			return nil
		}
		defer file.Close()

		scanner := bufio.NewScanner(file)
		lineNum := 1
		for scanner.Scan() {
			line := scanner.Text()
			if strings.Contains(strings.ToLower(line), query) {
				// Truncate snippet
				snippet := strings.TrimSpace(line)
				if len(snippet) > 100 {
					snippet = snippet[:100] + "..."
				}

				results = append(results, SearchResult{
					FilePath: "/" + relPath,
					Snippet:  snippet,
					LineNum:  lineNum,
				})
				// Limit matches per file to avoid flooding? Let's cap global results instead maybe.
			}
			lineNum++
		}

		// Cap results to 50
		if len(results) > 50 {
			// We can't return error here easily to stop Walk, but we can hack it or just slice at end
			// For simple implementation, let's just let it run but it might be slow for common terms.
			// Optimization: check len(results) here
		}

		return nil
	})

	if len(results) > 50 {
		results = results[:50]
	}

	return results, err
}
