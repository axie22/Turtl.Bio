package search

type SearchRequest struct {
	Query string `json:"query"`
}

type SearchResult struct {
	FilePath string `json:"file_path"`
	Snippet  string `json:"snippet"`
	LineNum  int    `json:"line_num"`
}

type SearchResponse struct {
	Results []SearchResult `json:"results"`
}
