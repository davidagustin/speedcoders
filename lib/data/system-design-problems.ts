export interface SystemDesignProblem {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  requirements: string[]
  constraints: string[]
  components: string[]
  solutions: string[]
  estimatedTime: number
  tags: string[]
  scale: string
  technologies: string[]
  architecture: string[]
  tradeoffs: string[]
  metrics: string[]
}

export const systemDesignProblems: SystemDesignProblem[] = [
  {
    id: 'sd-001',
    title: 'Design URL Shortener',
    description: 'Design a URL shortening service like TinyURL or Bitly that can handle millions of requests per day',
    difficulty: 'Easy',
    category: 'Web Services',
    requirements: [
      'Shorten long URLs to short URLs (e.g., 6-8 characters)',
      'Redirect short URLs to original URLs with low latency',
      'Handle high traffic (100M+ requests/day)',
      'Support custom short URLs',
      'Track click analytics and metrics',
      'Ensure high availability (99.9% uptime)',
      'Support URL expiration and deletion'
    ],
    constraints: [
      'URLs should be as short as possible (6-8 characters)',
      'System should be highly available and fault-tolerant',
      'Low latency for URL redirection (< 100ms)',
      'Support for custom URLs with collision handling',
      'Handle 100M+ daily requests',
      'Support URL analytics and tracking'
    ],
    components: [
      'Load Balancer (HAProxy/Nginx)',
      'Application Servers (Node.js/Python/Java)',
      'Database (PostgreSQL for metadata, Redis for caching)',
      'Cache Layer (Redis/Memcached)',
      'URL Generation Service',
      'Analytics Service',
      'CDN for global distribution'
    ],
    solutions: [
      'Use base62 encoding for URL generation (A-Z, a-z, 0-9)',
      'Implement distributed ID generation using Snowflake algorithm',
      'Use Redis for caching frequently accessed URLs',
      'Implement database sharding for scalability',
      'Use CDN for global content distribution',
      'Implement rate limiting and DDoS protection'
    ],
    estimatedTime: 45,
    tags: ['URL Shortening', 'Hash Functions', 'Caching', 'Database Design', 'Distributed Systems'],
    scale: '100M+ daily requests, 1B+ URLs stored',
    technologies: ['Redis', 'PostgreSQL', 'Node.js', 'Nginx', 'CDN'],
    architecture: ['Microservices', 'Event-Driven', 'CQRS'],
    tradeoffs: [
      'Consistency vs Availability: Choose eventual consistency for better availability',
      'Latency vs Storage: Cache frequently accessed URLs at the cost of memory',
      'Simplicity vs Features: Start simple, add analytics later'
    ],
    metrics: [
      'Response time: < 100ms for URL redirection',
      'Availability: 99.9% uptime',
      'Throughput: 100M+ requests/day',
      'Storage: Efficient encoding to minimize storage'
    ]
  },
  {
    id: 'sd-002',
    title: 'Design Chat System',
    description: 'Design a real-time chat system like WhatsApp or Slack supporting millions of concurrent users',
    difficulty: 'Medium',
    category: 'Real-time Systems',
    requirements: [
      'Real-time messaging between users with < 100ms latency',
      'Support group chats with up to 1000 members',
      'Message delivery status (sent, delivered, read)',
      'File sharing capabilities (images, documents, videos)',
      'Message history and search functionality',
      'Push notifications for offline users',
      'End-to-end encryption for security'
    ],
    constraints: [
      'Low latency message delivery (< 100ms)',
      'High availability and reliability (99.9% uptime)',
      'Support millions of concurrent users',
      'Message ordering and consistency',
      'Handle large file uploads efficiently',
      'Ensure message persistence and reliability'
    ],
    components: [
      'WebSocket Servers (Socket.io/Apache WebSocket)',
      'Message Queue System (RabbitMQ/Apache Kafka)',
      'Database (PostgreSQL for messages, MongoDB for files)',
      'File Storage Service (AWS S3/Google Cloud Storage)',
      'Push Notification Service (FCM/APNS)',
      'Search Service (Elasticsearch)',
      'Load Balancer and API Gateway'
    ],
    solutions: [
      'Use WebSockets for real-time bidirectional communication',
      'Implement message queues for reliability and scalability',
      'Use Redis for session management and presence tracking',
      'Implement database sharding for message storage',
      'Use CDN for file delivery and caching',
      'Implement read receipts and typing indicators'
    ],
    estimatedTime: 60,
    tags: ['Real-time', 'WebSockets', 'Message Queues', 'Push Notifications', 'File Storage'],
    scale: '10M+ concurrent users, 1B+ messages/day',
    technologies: ['Socket.io', 'Redis', 'PostgreSQL', 'RabbitMQ', 'AWS S3'],
    architecture: ['Event-Driven', 'Microservices', 'CQRS'],
    tradeoffs: [
      'Consistency vs Latency: Choose eventual consistency for better performance',
      'Storage vs Performance: Cache recent messages, archive old ones',
      'Security vs Performance: Implement encryption without significant latency impact'
    ],
    metrics: [
      'Message delivery latency: < 100ms',
      'Concurrent connections: 10M+ users',
      'Message throughput: 1B+ messages/day',
      'File upload success rate: 99.9%'
    ]
  },
  {
    id: 'sd-003',
    title: 'Design Rate Limiter',
    description: 'Design a distributed rate limiting system to control API usage across multiple services',
    difficulty: 'Medium',
    category: 'API Design',
    requirements: [
      'Limit requests per user/IP with configurable rules',
      'Support different rate limit algorithms (sliding window, fixed window, token bucket)',
      'Handle distributed systems and multiple data centers',
      'Provide rate limit headers in API responses',
      'Support different time windows (per second, minute, hour, day)',
      'Handle burst traffic and graceful degradation'
    ],
    constraints: [
      'Low latency rate limit checking (< 10ms)',
      'High availability and fault tolerance',
      'Accurate rate limiting across distributed systems',
      'Support for different time windows and algorithms',
      'Handle millions of requests per second'
    ],
    components: [
      'Rate Limiter Service (Redis-based)',
      'Configuration Service (Consul/etcd)',
      'Monitoring and Alerting Service',
      'API Gateway Integration',
      'Distributed Cache (Redis Cluster)',
      'Metrics Collection Service'
    ],
    solutions: [
      'Use Redis with Lua scripts for atomic rate limit operations',
      'Implement sliding window algorithm for accurate rate limiting',
      'Use token bucket algorithm for burst traffic handling',
      'Implement distributed rate limiting with consistent hashing',
      'Use circuit breakers for graceful degradation',
      'Cache rate limit data for performance'
    ],
    estimatedTime: 30,
    tags: ['Rate Limiting', 'Redis', 'Algorithms', 'API Design', 'Distributed Systems'],
    scale: '1M+ requests/second, 100K+ unique users',
    technologies: ['Redis', 'Lua', 'Consul', 'Prometheus', 'Grafana'],
    architecture: ['Microservices', 'Event-Driven'],
    tradeoffs: [
      'Accuracy vs Performance: Sliding window is more accurate but slower than fixed window',
      'Memory vs Accuracy: More memory for better accuracy',
      'Consistency vs Availability: Choose eventual consistency for better availability'
    ],
    metrics: [
      'Rate limit check latency: < 10ms',
      'False positive rate: < 0.1%',
      'System throughput: 1M+ requests/second',
      'Availability: 99.99% uptime'
    ]
  },
  {
    id: 'sd-004',
    title: 'Design Distributed Cache',
    description: 'Design a distributed caching system like Redis Cluster with high availability and fault tolerance',
    difficulty: 'Hard',
    category: 'Caching',
    requirements: [
      'High availability and fault tolerance with automatic failover',
      'Consistent hashing for data distribution across nodes',
      'Support for different data types (strings, hashes, lists, sets)',
      'Configurable TTL and eviction policies',
      'Horizontal scaling with dynamic node addition/removal',
      'Data replication and consistency guarantees'
    ],
    constraints: [
      'Low latency data access (< 5ms for cache hits)',
      'High throughput (100K+ operations/second per node)',
      'Data consistency and durability',
      'Minimal data loss during node failures',
      'Support for complex data structures'
    ],
    components: [
      'Cache Nodes (Redis instances)',
      'Load Balancer (HAProxy)',
      'Consistent Hashing Service',
      'Replication Service',
      'Failover Manager',
      'Configuration Management',
      'Monitoring and Health Checks'
    ],
    solutions: [
      'Use consistent hashing for data distribution and minimal rehashing',
      'Implement master-slave replication for fault tolerance',
      'Use gossip protocol for node communication and failure detection',
      'Implement automatic failover with sentinel nodes',
      'Use virtual nodes for better load distribution',
      'Implement data partitioning and sharding'
    ],
    estimatedTime: 75,
    tags: ['Distributed Systems', 'Consistent Hashing', 'Replication', 'Fault Tolerance', 'Caching'],
    scale: '100K+ operations/second, 1TB+ data, 100+ nodes',
    technologies: ['Redis', 'Consistent Hashing', 'Gossip Protocol', 'HAProxy'],
    architecture: ['Distributed', 'Master-Slave', 'Peer-to-Peer'],
    tradeoffs: [
      'Consistency vs Availability: Choose eventual consistency for better availability',
      'Performance vs Durability: In-memory for speed, persistence for durability',
      'Simplicity vs Features: Start with basic caching, add advanced features later'
    ],
    metrics: [
      'Cache hit latency: < 5ms',
      'Cache miss latency: < 50ms',
      'Throughput: 100K+ operations/second per node',
      'Availability: 99.99% uptime'
    ]
  },
  {
    id: 'sd-005',
    title: 'Design Search Engine',
    description: 'Design a search engine like Google or Elasticsearch handling billions of documents',
    difficulty: 'Hard',
    category: 'Search Systems',
    requirements: [
      'Fast full-text search with sub-second response time',
      'Support for complex queries (boolean, fuzzy, phrase)',
      'Ranking and relevance scoring using multiple factors',
      'Autocomplete suggestions and query suggestions',
      'Handle billions of documents and petabytes of data',
      'Real-time indexing and near real-time search',
      'Support for multiple languages and character sets'
    ],
    constraints: [
      'Sub-second search response time',
      'High availability and fault tolerance',
      'Accurate search results and relevance',
      'Support for multiple languages and character sets',
      'Handle billions of documents efficiently'
    ],
    components: [
      'Crawler Service (for web crawling)',
      'Indexing Service (document processing)',
      'Search Service (query processing)',
      'Ranking Service (relevance scoring)',
      'Suggestion Service (autocomplete)',
      'Storage Layer (distributed file system)',
      'Load Balancer and API Gateway'
    ],
    solutions: [
      'Use inverted index for fast full-text search',
      'Implement TF-IDF and BM25 for relevance scoring',
      'Use distributed indexing with MapReduce',
      'Implement caching for popular queries and results',
      'Use sharding for horizontal scaling',
      'Implement query optimization and execution planning'
    ],
    estimatedTime: 90,
    tags: ['Search', 'Indexing', 'Ranking', 'Distributed Systems', 'Information Retrieval'],
    scale: '1B+ documents, 1M+ queries/second, PB+ data',
    technologies: ['Elasticsearch', 'Lucene', 'MapReduce', 'Hadoop', 'Redis'],
    architecture: ['Distributed', 'Microservices', 'Event-Driven'],
    tradeoffs: [
      'Search Quality vs Speed: Better ranking algorithms are slower',
      'Index Size vs Performance: Larger indices are slower to search',
      'Freshness vs Performance: Real-time indexing impacts search performance'
    ],
    metrics: [
      'Search response time: < 1 second',
      'Indexing throughput: 10K+ documents/second',
      'Query throughput: 1M+ queries/second',
      'Search accuracy: 95%+ relevance score'
    ]
  },
  {
    id: 'sd-006',
    title: 'Design Video Streaming Platform',
    description: 'Design a video streaming platform like Netflix or YouTube supporting millions of concurrent viewers',
    difficulty: 'Hard',
    category: 'Media Systems',
    requirements: [
      'Stream videos in multiple qualities (240p to 4K)',
      'Support live streaming and video on demand',
      'Video transcoding and processing pipeline',
      'Content delivery optimization with global CDN',
      'User recommendations and personalization',
      'Analytics and monitoring for performance',
      'Support for multiple devices and platforms'
    ],
    constraints: [
      'Low latency video delivery (< 2 seconds)',
      'High bandwidth efficiency and compression',
      'Global content distribution',
      'Support for multiple devices and screen sizes',
      'Handle millions of concurrent viewers'
    ],
    components: [
      'Video Processing Service (transcoding)',
      'CDN Network (global distribution)',
      'Streaming Servers (HLS/DASH)',
      'Recommendation Engine (ML-based)',
      'Analytics Service (viewer metrics)',
      'Storage Service (video files)',
      'User Management Service'
    ],
    solutions: [
      'Use CDN for global content distribution and caching',
      'Implement adaptive bitrate streaming (HLS/DASH)',
      'Use video transcoding for multiple formats and qualities',
      'Implement recommendation algorithms using collaborative filtering',
      'Use edge computing for low-latency processing',
      'Implement video compression and optimization'
    ],
    estimatedTime: 120,
    tags: ['Video Streaming', 'CDN', 'Transcoding', 'Recommendations', 'Media Processing'],
    scale: '10M+ concurrent viewers, 1PB+ video data, 100K+ videos',
    technologies: ['FFmpeg', 'HLS', 'DASH', 'CDN', 'Machine Learning'],
    architecture: ['Microservices', 'Event-Driven', 'Edge Computing'],
    tradeoffs: [
      'Quality vs Bandwidth: Higher quality requires more bandwidth',
      'Latency vs Quality: Lower latency may reduce quality',
      'Storage vs Performance: More storage for better quality, but higher costs'
    ],
    metrics: [
      'Video start time: < 2 seconds',
      'Streaming quality: 99%+ uptime',
      'Concurrent viewers: 10M+ users',
      'Video processing: 1000+ videos/hour'
    ]
  },
  {
    id: 'sd-007',
    title: 'Design Social Media Feed',
    description: 'Design a social media feed system like Facebook or Twitter with real-time updates',
    difficulty: 'Hard',
    category: 'Social Systems',
    requirements: [
      'Real-time feed generation and updates',
      'Support for different content types (text, images, videos)',
      'Personalized feed based on user preferences',
      'Handle millions of posts and interactions',
      'Support for following/followers relationships',
      'Content moderation and filtering',
      'Analytics and engagement tracking'
    ],
    constraints: [
      'Low latency feed generation (< 100ms)',
      'High availability and scalability',
      'Real-time updates and notifications',
      'Handle viral content and traffic spikes',
      'Ensure content relevance and quality'
    ],
    components: [
      'Feed Generation Service',
      'Content Storage Service',
      'User Graph Service (followers/following)',
      'Recommendation Engine',
      'Real-time Update Service',
      'Content Moderation Service',
      'Analytics and Metrics Service'
    ],
    solutions: [
      'Use fan-out on write for immediate feed updates',
      'Implement hybrid approach (fan-out + pull) for efficiency',
      'Use graph databases for relationship management',
      'Implement content ranking algorithms',
      'Use caching for frequently accessed content',
      'Implement content moderation with ML'
    ],
    estimatedTime: 90,
    tags: ['Social Media', 'Feed Generation', 'Graph Databases', 'Real-time', 'Recommendations'],
    scale: '100M+ users, 1B+ posts/day, 10M+ concurrent users',
    technologies: ['Neo4j', 'Redis', 'Kafka', 'Machine Learning', 'GraphQL'],
    architecture: ['Microservices', 'Event-Driven', 'Graph-based'],
    tradeoffs: [
      'Consistency vs Performance: Eventual consistency for better performance',
      'Storage vs Speed: More storage for better personalization',
      'Relevance vs Freshness: Balance between relevant and fresh content'
    ],
    metrics: [
      'Feed generation time: < 100ms',
      'Content freshness: < 1 minute',
      'User engagement: 60%+ daily active users',
      'System throughput: 1M+ posts/hour'
    ]
  },
  {
    id: 'sd-008',
    title: 'Design E-commerce Platform',
    description: 'Design a scalable e-commerce platform like Amazon supporting millions of products and users',
    difficulty: 'Hard',
    category: 'E-commerce',
    requirements: [
      'Product catalog with search and filtering',
      'Shopping cart and checkout process',
      'Order management and tracking',
      'Payment processing and security',
      'Inventory management and stock tracking',
      'User reviews and ratings',
      'Recommendation system for products'
    ],
    constraints: [
      'High availability during peak shopping seasons',
      'Secure payment processing',
      'Accurate inventory tracking',
      'Fast product search and discovery',
      'Handle millions of concurrent users'
    ],
    components: [
      'Product Catalog Service',
      'Shopping Cart Service',
      'Order Management Service',
      'Payment Processing Service',
      'Inventory Management Service',
      'Search and Recommendation Service',
      'User Management Service'
    ],
    solutions: [
      'Use microservices architecture for scalability',
      'Implement event sourcing for order management',
      'Use distributed caching for product catalog',
      'Implement inventory reservation system',
      'Use CDN for product images and static content',
      'Implement payment gateway integration'
    ],
    estimatedTime: 100,
    tags: ['E-commerce', 'Microservices', 'Payment Processing', 'Inventory Management', 'Search'],
    scale: '10M+ products, 1M+ orders/day, 100K+ concurrent users',
    technologies: ['PostgreSQL', 'Redis', 'Elasticsearch', 'Kafka', 'Stripe/PayPal'],
    architecture: ['Microservices', 'Event-Driven', 'CQRS'],
    tradeoffs: [
      'Consistency vs Availability: Choose consistency for inventory, availability for catalog',
      'Performance vs Features: Start with core features, add advanced ones later',
      'Security vs Usability: Implement security without compromising user experience'
    ],
    metrics: [
      'Product search time: < 500ms',
      'Checkout completion rate: 70%+',
      'Order processing time: < 5 minutes',
      'System availability: 99.9% uptime'
    ]
  }
]

export const getSystemDesignProblems = () => systemDesignProblems

export const getSystemDesignProblemById = (id: string) => {
  return systemDesignProblems.find(problem => problem.id === id)
}

export const getSystemDesignProblemsByDifficulty = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
  return systemDesignProblems.filter(problem => problem.difficulty === difficulty)
}

export const getSystemDesignProblemsByCategory = (category: string) => {
  return systemDesignProblems.filter(problem => problem.category === category)
}

export const searchSystemDesignProblems = (query: string) => {
  const lowerQuery = query.toLowerCase()
  return systemDesignProblems.filter(problem => 
    problem.title.toLowerCase().includes(lowerQuery) ||
    problem.description.toLowerCase().includes(lowerQuery) ||
    problem.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    problem.category.toLowerCase().includes(lowerQuery)
  )
}
