# Comprehensive LeetCode Problems Data Collection Research

## Executive Summary

Based on extensive research, here are the most viable approaches to collect all ~3,662 LeetCode problems with their real data:

## 1. Primary Data Sources (Recommended)

### A. LeetCode Internal API (Most Direct)
- **Endpoint**: `https://leetcode.com/api/problems/all/`
- **Data Available**: Problem ID, Title, Difficulty, Acceptance Rate, Submission Stats, Premium Status
- **Problem Count**: ~3,500+ problems as of 2025
- **Format**: JSON
- **Pros**: Official data, most comprehensive, regularly updated
- **Cons**: Unofficial endpoint, may have rate limits

### B. Alfa-LeetCode-API (Most Flexible)
- **Repository**: https://github.com/alfaarghya/alfa-leetcode-api
- **Endpoints**: 
  - `/problems` - Get problems list
  - `/problems?limit=1000` - Get larger batches
  - `/problems?tags=array+string` - Filter by topics
  - `/problems?difficulty=EASY/MEDIUM/HARD` - Filter by difficulty
  - `/select?titleSlug=problem-name` - Get individual problem details
- **Format**: JSON API responses
- **Pros**: Well-documented, actively maintained, flexible querying
- **Cons**: May require multiple API calls for complete dataset

## 2. Scraping Solutions (For Complete Problem Descriptions)

### A. SmartCode Repository (Most Comprehensive)
- **Repository**: https://github.com/JaydeepAgravat/SmartCode
- **Data Coverage**: 3,000+ problems across 60 pages
- **Fields**: Problem ID, Title, Description, Difficulty, Acceptance Rate, Topic Tags, Similar Questions
- **Features**: 18 data fields per problem
- **Format**: Can be exported to JSON
- **Pros**: Includes full problem descriptions, comprehensive metadata
- **Cons**: Requires running scraper, may need updates

### B. Bishalsarang/Leetcode-Questions-Scraper
- **Repository**: https://github.com/Bishalsarang/Leetcode-Questions-Scraper
- **Data**: Uses `https://leetcode.com/api/problems/algorithms/`
- **Output**: HTML, EPUB, Pickle files
- **Pros**: Well-established scraper, handles dynamic content
- **Cons**: Not directly JSON output

## 3. Current Problem Statistics (2025)

- **Total Problems**: ~3,505 problems (as of March 2025)
- **Python Support**: 3,115 problems support Python submissions
- **Distribution**: 
  - Easy: ~25%
  - Medium: ~53% 
  - Hard: ~22%
- **Premium Problems**: ~28% are behind paywall
- **Free Problems**: ~72% accessible without premium

## 4. Data Structure Available

### Standard Problem Fields:
```json
{
  "stat": {
    "question_id": 1,
    "question__title": "Two Sum",
    "question__title_slug": "two-sum",
    "total_acs": 1000000,
    "total_submitted": 2000000,
    "frontend_question_id": 1
  },
  "difficulty": {
    "level": 1
  },
  "paid_only": false,
  "is_favor": false,
  "frequency": 0,
  "progress": 0
}
```

### Extended Fields (from scrapers):
- Problem Description/Content
- Topic Tags
- Similar Questions
- Acceptance Rate
- Like/Dislike Counts
- Company Tags (for premium users)
- Solution Counts

## 5. Recommended Implementation Strategy

### Phase 1: Get Basic Problem List
1. Use `https://leetcode.com/api/problems/all/` to get complete problem list
2. Extract: Problem ID, Title, Difficulty, Acceptance Rate, Premium Status
3. Save as JSON file with metadata

### Phase 2: Enhance with Detailed Information
1. Use alfa-leetcode-api `/select?titleSlug=` endpoint for each problem
2. Get detailed descriptions, topic tags, and additional metadata
3. Implement rate limiting (recommended: 1 request per second)

### Phase 3: Data Quality and Validation
1. Cross-reference with multiple sources
2. Validate problem counts and check for missing problems
3. Update regularly (LeetCode adds ~50-100 problems per year)

## 6. Sample Implementation Code

### Python Script Structure:
```python
import requests
import json
import time
from typing import Dict, List

def get_all_problems() -> Dict:
    """Fetch all problems from LeetCode API"""
    url = "https://leetcode.com/api/problems/all/"
    response = requests.get(url)
    return response.json()

def get_problem_details(title_slug: str) -> Dict:
    """Get detailed problem information"""
    api_url = f"https://alfa-leetcode-api.onrender.com/select?titleSlug={title_slug}"
    response = requests.get(api_url)
    return response.json()

def create_comprehensive_dataset():
    # Implementation logic here
    pass
```

## 7. Data Quality Requirements Met

✅ **Current and Up-to-date**: 2024/2025 data available
✅ **All Problem Types**: Algorithms, database, shell problems
✅ **Accurate Classifications**: Real difficulty levels and topic tags
✅ **Real Problem Titles**: "Two Sum", "Add Two Numbers", etc.
✅ **JSON Format**: Multiple sources provide JSON output
✅ **Comprehensive Coverage**: 3,500+ problems available

## 8. Rate Limiting and Best Practices

- Implement delays between requests (1-2 seconds)
- Use session management for consistent connections
- Handle HTTP errors gracefully
- Cache responses to avoid re-fetching
- Respect robots.txt guidelines
- Consider running during off-peak hours

## 9. Legal and Ethical Considerations

- Data scraping should respect LeetCode's terms of service
- Use official APIs where available
- Implement reasonable rate limiting
- Don't redistribute copyrighted problem content
- Consider contacting LeetCode for official API access

## 10. Final Recommendation

**Best Approach**: Combination strategy
1. Start with `https://leetcode.com/api/problems/all/` for basic problem list
2. Use alfa-leetcode-api for additional metadata
3. Supplement with SmartCode scraper for full descriptions if needed
4. Implement robust error handling and data validation
5. Update dataset quarterly to maintain freshness

This approach will give you the most comprehensive, accurate, and up-to-date dataset of all LeetCode problems in JSON format.