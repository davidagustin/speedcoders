# Consolidated LeetCode Data

This directory contains consolidated data from all the LeetCode problem datasets, organized into a single comprehensive JSON file.

## Files

### Main Consolidated Files

- **`consolidated-leetcode-data.json`** - Basic consolidated data (16.65MB)
- **`consolidated-leetcode-data-enhanced.json`** - Enhanced version with indexes and better organization (18.83MB)

### Original Data Files

The consolidated data includes information from all the original files in this directory, organized by category.

## Data Structure

The enhanced consolidated data has the following structure:

```json
{
  "metadata": {
    "consolidationDate": "2025-08-26T11:19:57.154Z",
    "version": "2.0",
    "totalFiles": 21,
    "totalSize": 17840000,
    "dataSources": [...],
    "summary": {
      "totalProblems": 3662,
      "totalVerified": 15,
      "totalCorrected": 1044,
      "totalUnverified": 2603,
      "totalAgents": 37,
      "totalAlgorithms": 26,
      "totalQuizCategories": 5,
      "problemsByDifficulty": {
        "Easy": 1257,
        "Medium": 1175,
        "Hard": 1230
      }
    }
  },
  "datasets": {
    "problems": {
      "allProblems": {...},
      "curatedProblems": {...},
      "realProblems": {...},
      "verifiedProblems": {...}
    },
    "verification": {
      "verificationReport": {...}
    },
    "distribution": {
      "agentDistribution": {...},
      "agentStatus": {...}
    },
    "quiz": {
      "sampleQuiz": {...},
      "quizProblems": {...}
    },
    "curation": {
      "batches": {...}
    },
    "other": {
      "clientData": {...},
      "problemsExport": {...}
    }
  },
  "indexes": {
    "problems": {
      "1": {
        "id": 1,
        "title": "Two Sum",
        "difficulty": "Easy",
        "algorithms": ["Hash Table", "Array"],
        "source": "curatedProblems",
        "verificationStatus": "verified_correct"
      }
    },
    "algorithms": {
      "Hash Table": [1, 3, 15, ...],
      "Array": [1, 4, 11, ...]
    },
    "difficulties": {
      "Easy": [1, 7, 9, ...],
      "Medium": [2, 3, 5, ...],
      "Hard": [4, 10, 23, ...]
    },
    "agents": {
      "1": [1, 2, 3, ...],
      "2": [8, 9, 10, ...]
    }
  }
}
```

## Usage

### Using the Data Utils Script

The `scripts/data-utils.js` script provides convenient functions to work with the consolidated data:

```bash
# Print summary report
node scripts/data-utils.js summary

# Search problems by title
node scripts/data-utils.js search "Two Sum"

# Get problems by algorithm
node scripts/data-utils.js algorithm "Dynamic Programming"

# Get problems by difficulty
node scripts/data-utils.js difficulty "Easy"

# Export filtered data subset
node scripts/data-utils.js export --algorithms "Hash Table,Array" --difficulties "Easy,Medium" --output "hash-table-problems.json"
```

### Using in Your Code

```javascript
const { loadConsolidatedData, getProblemsByAlgorithm } = require('./scripts/data-utils');

// Load the consolidated data
const data = loadConsolidatedData();

// Get all problems using Dynamic Programming
const dpProblems = getProblemsByAlgorithm(data, 'Dynamic Programming');

// Get all Easy problems
const easyProblems = getProblemsByDifficulty(data, 'Easy');

// Search for problems containing "tree"
const treeProblems = searchProblemsByTitle(data, 'tree');
```

## Data Categories

### Problems
- **allProblems**: All LeetCode problems (3662)
- **curatedProblems**: Manually curated problems with metadata
- **realProblems**: Problems from LeetCode API
- **verifiedProblems**: Problems that have been verified

### Verification
- **verificationReport**: Status of problem verification (verified, corrected, unverified)

### Distribution
- **agentDistribution**: Problems assigned to different agents
- **agentStatus**: Status of each agent

### Quiz
- **sampleQuiz**: Sample quiz problems organized by difficulty
- **quizProblems**: Additional quiz problem sets

### Curation
- **batches**: TypeScript/JavaScript files containing curated problem batches

## Indexes

The enhanced version includes several indexes for fast data access:

1. **Problems Index**: All problems indexed by ID with verification status
2. **Algorithms Index**: Problems grouped by algorithm type
3. **Difficulties Index**: Problems grouped by difficulty level
4. **Agents Index**: Problems grouped by assigned agent

## Statistics

- **Total Problems**: 3,662
- **Algorithms**: 26 different algorithm types
- **Agents**: 37 different agents
- **Verification Status**:
  - Verified: 15 problems
  - Corrected: 1,044 problems
  - Unverified: 2,603 problems
- **Difficulty Distribution**:
  - Easy: 1,257 problems
  - Medium: 1,175 problems
  - Hard: 1,230 problems

## File Sizes

- **Original scattered files**: ~17.84MB total
- **Consolidated basic**: 16.65MB
- **Consolidated enhanced**: 18.83MB

## Benefits of Consolidation

1. **Single Source of Truth**: All data in one place
2. **Fast Access**: Indexed data for quick queries
3. **Consistent Structure**: Standardized format across all data
4. **Easy Analysis**: Built-in utilities for data exploration
5. **Reduced Complexity**: No need to manage multiple files

## Updating the Data

To update the consolidated data when new files are added:

```bash
# Run the basic consolidation
node scripts/consolidate-data.js

# Run the enhanced consolidation (recommended)
node scripts/consolidate-data-enhanced.js
```

The scripts will automatically detect and include all JSON and JavaScript files in the data directory.
