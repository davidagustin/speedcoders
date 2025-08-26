# LeetCode Problem Scraper

A comprehensive tool to scrape all LeetCode problem descriptions and metadata using both Puppeteer (browser automation) and GraphQL API methods.

## Features

- 🚀 **Dual Scraping Methods**: Both Puppeteer and GraphQL API approaches
- 📊 **Comprehensive Data**: Problem descriptions, difficulty, tags, solutions, and more
- 🔄 **Retry Logic**: Automatic retry with exponential backoff
- 💾 **Progress Tracking**: Save progress and resume capability
- 📁 **Organized Output**: Individual files and consolidated JSON
- ⚡ **Rate Limiting**: Respectful scraping with configurable delays

## Installation

1. Navigate to the scripts directory:
```bash
cd scripts
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Option 1: GraphQL API Scraper (Recommended)

The GraphQL API scraper is faster, more reliable, and more respectful to LeetCode's servers:

```bash
# Run the GraphQL scraper
npm run scrape

# Or directly
node leetcode-graphql-scraper.js
```

### Option 2: Puppeteer Scraper

The Puppeteer scraper uses browser automation (slower but more comprehensive):

```bash
# Run the Puppeteer scraper
node leetcode-scraper.js
```

### Testing

Test the scraper with a single problem:

```bash
npm test
# Or
node test-scraper.js
```

## Output Structure

The scraper creates a `data/` directory with the following files:

```
data/
├── problem-1-two-sum.json          # Individual problem files
├── problem-2-add-two-numbers.json
├── ...
├── all-leetcode-problems-graphql.json  # Complete dataset
├── scraping-progress.json              # Progress tracking
└── failed-problems-graphql.json        # Failed scrapes
```

## Data Format

Each problem includes:

```json
{
  "questionFrontendId": "1",
  "title": "Two Sum",
  "titleSlug": "two-sum",
  "difficulty": "Easy",
  "content": "<p>Given an array of integers...",
  "topicTags": [
    {
      "name": "Array",
      "slug": "array"
    }
  ],
  "codeSnippets": [
    {
      "lang": "cpp",
      "code": "class Solution {..."
    }
  ],
  "stats": "{\"totalAccepted\": \"...\"}",
  "hints": ["Hint 1", "Hint 2"],
  "sampleTestCase": "[2,7,11,15]\n9",
  "scrapedAt": "2024-01-01T00:00:00.000Z"
}
```

## Configuration

### Rate Limiting

Adjust scraping speed in the scraper files:

```javascript
// In leetcode-graphql-scraper.js
await this.delay(500 + Math.random() * 1000); // 0.5-1.5 seconds

// In leetcode-scraper.js
this.rateLimitDelay = 2000; // 2 seconds between requests
```

### Output Directory

Change the output directory in the constructor:

```javascript
this.outputDir = path.join(__dirname, '../your-custom-path');
```

## Advanced Usage

### Resume Scraping

The scraper automatically saves progress. To resume from where it left off, modify the scraper to check the progress file.

### Filter Problems

Modify the GraphQL query to filter problems by difficulty, tags, or other criteria:

```javascript
variables: {
    categorySlug: "",
    limit: 3000,
    skip: 0,
    filters: {
        difficulty: "EASY", // or "MEDIUM", "HARD"
        tags: ["array", "hash-table"]
    }
}
```

### Custom Data Processing

Import and extend the scraper classes:

```javascript
const { LeetCodeGraphQLScraper } = require('./leetcode-graphql-scraper');

class CustomScraper extends LeetCodeGraphQLScraper {
    async processProblem(problemData) {
        // Custom processing logic
        return problemData;
    }
}
```

## Troubleshooting

### Common Issues

1. **Rate Limiting**: If you get blocked, increase the delay between requests
2. **Network Errors**: Check your internet connection and try again
3. **Invalid Selectors**: LeetCode may update their HTML structure - update selectors accordingly

### Error Handling

The scraper includes comprehensive error handling:
- Failed problems are saved separately
- Progress is saved every 10-20 problems
- Automatic retry with exponential backoff

### Logs

Monitor the console output for:
- ✅ Successful scrapes
- ❌ Failed scrapes
- 📊 Progress updates
- 🔄 Retry attempts

## Legal and Ethical Considerations

- **Respect Rate Limits**: The scraper includes delays to be respectful
- **Terms of Service**: Ensure compliance with LeetCode's terms
- **Educational Use**: Intended for educational and personal use only
- **No Commercial Use**: Do not use scraped data for commercial purposes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the error logs
3. Open an issue with detailed information

---

**Note**: This tool is for educational purposes. Always respect website terms of service and rate limits.
