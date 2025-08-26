import { useEffect, useMemo, useRef, useState } from "react";
import {
	algorithmCategories,
	allLeetcodeProblems,
	companyTags,
} from "../data/allProblems";

function AdvancedSearch({ onResults, onClose }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState({
		difficulties: [],
		algorithms: [],
		categories: [],
		companies: [],
		solved: "all",
		timeComplexity: [],
		spaceComplexity: [],
		tags: [],
		rating: { min: 0, max: 5 },
		problemLength: "all",
		hasVideo: false,
		hasEditorial: false,
		isPremium: false,
	});
	const [showFilters, setShowFilters] = useState(false);
	const [searchHistory, setSearchHistory] = useState([]);
	const [savedSearches, setSavedSearches] = useState([]);
	const searchInputRef = useRef(null);

	// Load saved searches on mount
	useEffect(() => {
		const saved = JSON.parse(localStorage.getItem("savedSearches") || "[]");
		setSavedSearches(saved);

		const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
		setSearchHistory(history);
	}, []);

	// Search suggestions based on query
	const searchSuggestions = useMemo(() => {
		if (!searchQuery || searchQuery.length < 2) return [];

		const query = searchQuery.toLowerCase();
		const suggestions = new Set();

		// Add problem titles that match
		allLeetcodeProblems
			.filter((p) => p.title.toLowerCase().includes(query))
			.slice(0, 5)
			.forEach((p) => suggestions.add(`title:${p.title}`));

		// Add algorithms that match
		Object.values(algorithmCategories)
			.flat()
			.filter((algo) => algo.toLowerCase().includes(query))
			.slice(0, 3)
			.forEach((algo) => suggestions.add(`algorithm:${algo}`));

		// Add companies that match
		Object.keys(companyTags)
			.filter((company) => company.toLowerCase().includes(query))
			.slice(0, 3)
			.forEach((company) => suggestions.add(`company:${company}`));

		return Array.from(suggestions).slice(0, 8);
	}, [searchQuery]);

	// Advanced search with multiple criteria
	const performAdvancedSearch = () => {
		let results = [...allLeetcodeProblems];

		// Text search in title, description, and tags
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			results = results.filter((problem) => {
				// Check for special search operators
				if (query.startsWith("title:")) {
					return problem.title.toLowerCase().includes(query.substring(6));
				}
				if (query.startsWith("id:")) {
					return problem.id.toString() === query.substring(3);
				}
				if (query.startsWith("algorithm:")) {
					const algo = query.substring(10);
					return problem.correctAlgorithms.some((a) =>
						a.toLowerCase().includes(algo),
					);
				}
				if (query.startsWith("company:")) {
					const company = query.substring(8);
					return Object.entries(companyTags).some(
						([comp, ids]) =>
							comp.toLowerCase().includes(company) && ids.includes(problem.id),
					);
				}

				// Regular text search
				return (
					problem.title.toLowerCase().includes(query) ||
					problem.description.toLowerCase().includes(query) ||
					problem.correctAlgorithms.some((algo) =>
						algo.toLowerCase().includes(query),
					)
				);
			});
		}

		// Apply filters
		if (filters.difficulties.length > 0) {
			results = results.filter((p) =>
				filters.difficulties.includes(p.difficulty),
			);
		}

		if (filters.algorithms.length > 0) {
			results = results.filter((p) =>
				p.correctAlgorithms.some((algo) => filters.algorithms.includes(algo)),
			);
		}

		if (filters.categories.length > 0) {
			results = results.filter((p) =>
				filters.categories.some(
					(cat) =>
						algorithmCategories[cat] &&
						p.correctAlgorithms.some((algo) =>
							algorithmCategories[cat].includes(algo),
						),
				),
			);
		}

		if (filters.companies.length > 0) {
			results = results.filter((p) =>
				filters.companies.some((company) =>
					companyTags[company]?.includes(p.id),
				),
			);
		}

		// Problem length filter
		if (filters.problemLength !== "all") {
			results = results.filter((p) => {
				const descLength = p.description.length;
				switch (filters.problemLength) {
					case "short":
						return descLength < 500;
					case "medium":
						return descLength >= 500 && descLength < 1500;
					case "long":
						return descLength >= 1500;
					default:
						return true;
				}
			});
		}

		// Save search to history
		if (searchQuery && !searchHistory.includes(searchQuery)) {
			const newHistory = [searchQuery, ...searchHistory.slice(0, 9)];
			setSearchHistory(newHistory);
			localStorage.setItem("searchHistory", JSON.stringify(newHistory));
		}

		onResults(results, { query: searchQuery, filters, count: results.length });
	};

	const clearFilters = () => {
		setFilters({
			difficulties: [],
			algorithms: [],
			categories: [],
			companies: [],
			solved: "all",
			timeComplexity: [],
			spaceComplexity: [],
			tags: [],
			rating: { min: 0, max: 5 },
			problemLength: "all",
			hasVideo: false,
			hasEditorial: false,
			isPremium: false,
		});
		setSearchQuery("");
	};

	const saveCurrentSearch = () => {
		if (!searchQuery) return;

		const searchData = {
			id: Date.now(),
			name: searchQuery,
			query: searchQuery,
			filters: filters,
			timestamp: new Date().toISOString(),
		};

		const newSaved = [searchData, ...savedSearches.slice(0, 9)];
		setSavedSearches(newSaved);
		localStorage.setItem("savedSearches", JSON.stringify(newSaved));
	};

	const loadSavedSearch = (saved) => {
		setSearchQuery(saved.query);
		setFilters(saved.filters);
		performAdvancedSearch();
	};

	const deleteSavedSearch = (id) => {
		const newSaved = savedSearches.filter((s) => s.id !== id);
		setSavedSearches(newSaved);
		localStorage.setItem("savedSearches", JSON.stringify(newSaved));
	};

	const handleFilterChange = (filterType, value, checked) => {
		setFilters((prev) => {
			if (Array.isArray(prev[filterType])) {
				return {
					...prev,
					[filterType]: checked
						? [...prev[filterType], value]
						: prev[filterType].filter((item) => item !== value),
				};
			} else {
				return { ...prev, [filterType]: value };
			}
		});
	};

	const getActiveFiltersCount = () => {
		let count = 0;
		count += filters.difficulties.length;
		count += filters.algorithms.length;
		count += filters.categories.length;
		count += filters.companies.length;
		if (filters.solved !== "all") count++;
		if (filters.problemLength !== "all") count++;
		if (filters.hasVideo || filters.hasEditorial || filters.isPremium) count++;
		return count;
	};

	return (
		<div className="advanced-search-overlay">
			<div className="advanced-search-modal">
				<div className="search-header">
					<h2>🔍 Advanced Search</h2>
					<button onClick={onClose} className="close-btn">
						×
					</button>
				</div>

				<div className="search-content">
					{/* Main search input */}
					<div className="search-input-section">
						<div className="search-input-container">
							<input
								ref={searchInputRef}
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search problems, algorithms, or use operators like 'title:', 'algorithm:', 'company:'"
								className="advanced-search-input"
								onKeyPress={(e) => e.key === "Enter" && performAdvancedSearch()}
							/>
							<div className="search-actions">
								<button
									onClick={saveCurrentSearch}
									className="save-search-btn"
									title="Save Search"
								>
									💾
								</button>
								<button onClick={performAdvancedSearch} className="search-btn">
									Search
								</button>
							</div>
						</div>

						{/* Search suggestions */}
						{searchSuggestions.length > 0 && (
							<div className="search-suggestions">
								{searchSuggestions.map((suggestion, index) => (
									<button
										key={index}
										onClick={() => setSearchQuery(suggestion)}
										className="suggestion-item"
									>
										{suggestion}
									</button>
								))}
							</div>
						)}
					</div>

					{/* Filters toggle */}
					<div className="filters-toggle">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className={`filters-toggle-btn ${getActiveFiltersCount() > 0 ? "active" : ""}`}
						>
							🎛️ Filters{" "}
							{getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
						</button>
						{getActiveFiltersCount() > 0 && (
							<button onClick={clearFilters} className="clear-filters-btn">
								Clear All
							</button>
						)}
					</div>

					{/* Filters panel */}
					{showFilters && (
						<div className="filters-panel">
							<div className="filters-grid">
								{/* Difficulty filter */}
								<div className="filter-group">
									<h4>Difficulty</h4>
									<div className="filter-options">
										{["Easy", "Medium", "Hard"].map((diff) => (
											<label key={diff} className="filter-checkbox">
												<input
													type="checkbox"
													checked={filters.difficulties.includes(diff)}
													onChange={(e) =>
														handleFilterChange(
															"difficulties",
															diff,
															e.target.checked,
														)
													}
												/>
												<span
													className={`difficulty-label ${diff.toLowerCase()}`}
												>
													{diff}
												</span>
											</label>
										))}
									</div>
								</div>

								{/* Categories filter */}
								<div className="filter-group">
									<h4>Algorithm Categories</h4>
									<div className="filter-options scrollable">
										{Object.keys(algorithmCategories).map((category) => (
											<label key={category} className="filter-checkbox">
												<input
													type="checkbox"
													checked={filters.categories.includes(category)}
													onChange={(e) =>
														handleFilterChange(
															"categories",
															category,
															e.target.checked,
														)
													}
												/>
												<span>{category}</span>
											</label>
										))}
									</div>
								</div>

								{/* Companies filter */}
								<div className="filter-group">
									<h4>Companies</h4>
									<div className="filter-options scrollable">
										{Object.keys(companyTags).map((company) => (
											<label key={company} className="filter-checkbox">
												<input
													type="checkbox"
													checked={filters.companies.includes(company)}
													onChange={(e) =>
														handleFilterChange(
															"companies",
															company,
															e.target.checked,
														)
													}
												/>
												<span>{company}</span>
											</label>
										))}
									</div>
								</div>

								{/* Problem length filter */}
								<div className="filter-group">
									<h4>Problem Length</h4>
									<div className="filter-options">
										<label className="filter-radio">
											<input
												type="radio"
												name="problemLength"
												value="all"
												checked={filters.problemLength === "all"}
												onChange={(e) =>
													handleFilterChange("problemLength", e.target.value)
												}
											/>
											<span>All</span>
										</label>
										<label className="filter-radio">
											<input
												type="radio"
												name="problemLength"
												value="short"
												checked={filters.problemLength === "short"}
												onChange={(e) =>
													handleFilterChange("problemLength", e.target.value)
												}
											/>
											<span>Short (&lt; 500 chars)</span>
										</label>
										<label className="filter-radio">
											<input
												type="radio"
												name="problemLength"
												value="medium"
												checked={filters.problemLength === "medium"}
												onChange={(e) =>
													handleFilterChange("problemLength", e.target.value)
												}
											/>
											<span>Medium (500-1500 chars)</span>
										</label>
										<label className="filter-radio">
											<input
												type="radio"
												name="problemLength"
												value="long"
												checked={filters.problemLength === "long"}
												onChange={(e) =>
													handleFilterChange("problemLength", e.target.value)
												}
											/>
											<span>Long (&gt; 1500 chars)</span>
										</label>
									</div>
								</div>

								{/* Additional filters */}
								<div className="filter-group">
									<h4>Additional Options</h4>
									<div className="filter-options">
										<label className="filter-checkbox">
											<input
												type="checkbox"
												checked={filters.hasVideo}
												onChange={(e) =>
													handleFilterChange("hasVideo", e.target.checked)
												}
											/>
											<span>Has Video Solution</span>
										</label>
										<label className="filter-checkbox">
											<input
												type="checkbox"
												checked={filters.hasEditorial}
												onChange={(e) =>
													handleFilterChange("hasEditorial", e.target.checked)
												}
											/>
											<span>Has Editorial</span>
										</label>
										<label className="filter-checkbox">
											<input
												type="checkbox"
												checked={filters.isPremium}
												onChange={(e) =>
													handleFilterChange("isPremium", e.target.checked)
												}
											/>
											<span>Premium Only</span>
										</label>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Search history and saved searches */}
					<div className="search-management">
						{/* Search History */}
						{searchHistory.length > 0 && (
							<div className="search-history">
								<h4>📝 Recent Searches</h4>
								<div className="history-items">
									{searchHistory.map((query, index) => (
										<button
											key={index}
											onClick={() => setSearchQuery(query)}
											className="history-item"
										>
											{query}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Saved Searches */}
						{savedSearches.length > 0 && (
							<div className="saved-searches">
								<h4>⭐ Saved Searches</h4>
								<div className="saved-items">
									{savedSearches.map((saved) => (
										<div key={saved.id} className="saved-item">
											<div className="saved-info">
												<span className="saved-name">{saved.name}</span>
												<span className="saved-date">
													{new Date(saved.timestamp).toLocaleDateString()}
												</span>
											</div>
											<div className="saved-actions">
												<button
													onClick={() => loadSavedSearch(saved)}
													className="load-btn"
												>
													Load
												</button>
												<button
													onClick={() => deleteSavedSearch(saved.id)}
													className="delete-btn"
												>
													🗑️
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Search tips */}
					<div className="search-tips">
						<h4>💡 Search Tips</h4>
						<div className="tips-list">
							<div className="tip">
								<strong>title:</strong> Search in problem titles (e.g.,
								"title:two sum")
							</div>
							<div className="tip">
								<strong>algorithm:</strong> Search by algorithm (e.g.,
								"algorithm:dynamic")
							</div>
							<div className="tip">
								<strong>company:</strong> Search by company (e.g.,
								"company:google")
							</div>
							<div className="tip">
								<strong>id:</strong> Search by problem ID (e.g., "id:1")
							</div>
						</div>
					</div>
				</div>

				<div className="search-footer">
					<button onClick={clearFilters} className="clear-btn">
						Clear All
					</button>
					<button onClick={performAdvancedSearch} className="search-main-btn">
						🔍 Search Problems
					</button>
				</div>
			</div>
		</div>
	);
}

export default AdvancedSearch;
