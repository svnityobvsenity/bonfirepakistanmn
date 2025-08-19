# Bonfire Scaling Guide

This document provides comprehensive scaling recommendations for the Bonfire chat application as it grows from a small preview to supporting thousands of concurrent users.

## Current Architecture

### Frontend
- **Next.js App Router** with static generation and server-side rendering
- **Supabase** for authentication, database, and real-time subscriptions
- **WebRTC** for peer-to-peer voice communication
- **Netlify** for frontend hosting

### Backend
- **Supabase** (PostgreSQL) for data persistence
- **Supabase Realtime** for live updates
- **Node.js WebSocket server** for WebRTC signaling
- **Supabase Storage** for file uploads

## Scaling Thresholds & Recommendations

### 1. User Scale: 0-1,000 Concurrent Users

**Current Setup (Preview)**
- ✅ Supabase Free Tier (50,000 monthly active users)
- ✅ Netlify Free Tier (100GB bandwidth/month)
- ✅ In-memory rate limiting
- ✅ Single signaling server instance

**Recommendations:**
- Monitor Supabase connection limits (2,000 concurrent connections)
- Set up basic monitoring and alerting
- Implement proper error handling and retry logic

### 2. User Scale: 1,000-10,000 Concurrent Users

**Required Changes:**

#### Database Scaling
```sql
-- Add performance indexes
CREATE INDEX CONCURRENTLY idx_messages_channel_created_at 
ON messages(channel_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_dm_messages_dm_created_at 
ON dm_messages(dm_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_presence_status_active 
ON presence(status, last_active) 
WHERE status != 'offline';

-- Partition large tables (if needed)
CREATE TABLE messages_partitioned (
  LIKE messages INCLUDING ALL
) PARTITION BY RANGE (created_at);
```

#### Supabase Upgrades
- **Pro Plan** ($25/month): 100,000 monthly active users
- **Team Plan** ($599/month): 1,000,000 monthly active users
- Enable connection pooling for better performance
- Set up read replicas for heavy read workloads

#### Rate Limiting
```typescript
// Replace in-memory store with Redis
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export class RedisRateLimiter extends RateLimiter {
  private async getKey(key: string): Promise<number> {
    const result = await redis.get(key)
    return result ? parseInt(result) : 0
  }
  
  private async incrementKey(key: string, windowMs: number): Promise<number> {
    const multi = redis.multi()
    multi.incr(key)
    multi.expire(key, Math.ceil(windowMs / 1000))
    const results = await multi.exec()
    return results?.[0]?.[1] as number || 0
  }
}
```

#### Signaling Server Scaling
```javascript
// Add load balancing with sticky sessions
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
} else {
  // Worker process
  require('./src/index.js')
}
```

### 3. User Scale: 10,000-100,000 Concurrent Users

**Major Architecture Changes:**

#### Database Sharding
```sql
-- Implement horizontal sharding by user_id
-- Shard 1: Users 1-100,000
-- Shard 2: Users 100,001-200,000
-- etc.

-- Use application-level routing
const getShardForUser = (userId: string) => {
  const hash = crypto.createHash('md5').update(userId).digest('hex')
  const shardIndex = parseInt(hash.substring(0, 8), 16) % SHARD_COUNT
  return `shard_${shardIndex}`
}
```

#### Voice Architecture: Mesh to SFU Migration

**Current (Mesh):** Each user connects to every other user
- ✅ Works well for ≤12 users per channel
- ❌ O(n²) connections, high bandwidth usage

**SFU (Selective Forwarding Unit):**
```typescript
// Replace WebRTC mesh with SFU architecture
interface SFUConfig {
  sfuUrl: string
  roomId: string
  userId: string
}

class SFUVoiceClient {
  private sfuConnection: RTCPeerConnection
  
  async joinRoom(config: SFUConfig) {
    // Connect to SFU server instead of peers
    this.sfuConnection = new RTCPeerConnection()
    
    // Send local stream to SFU
    this.localStream.getTracks().forEach(track => {
      this.sfuConnection.addTrack(track, this.localStream!)
    })
    
    // Receive mixed audio from SFU
    this.sfuConnection.ontrack = (event) => {
      this.handleRemoteStream(event.streams[0])
    }
  }
}
```

**SFU Implementation Options:**
1. **Jitsi Meet** (Open source)
2. **Janus WebRTC Server** (Open source)
3. **Mediasoup** (Open source, most flexible)
4. **Agora** (Commercial)
5. **Twilio Video** (Commercial)

#### Recommended SFU Setup (Mediasoup):
```javascript
// mediasoup-server.js
const mediasoup = require('mediasoup')

const worker = await mediasoup.createWorker({
  logLevel: 'warn',
  rtcMinPort: 10000,
  rtcMaxPort: 10100,
})

const router = await worker.createRouter({
  mediaCodecs: [
    {
      kind: 'audio',
      mimeType: 'audio/opus',
      clockRate: 48000,
      channels: 2,
    }
  ],
})

// Handle room creation and participant management
```

#### Real-time Infrastructure
```typescript
// Replace Supabase Realtime with custom solution
import { createClient } from '@supabase/supabase-js'

// For high-scale real-time, consider:
// 1. Redis Pub/Sub
// 2. Apache Kafka
// 3. AWS EventBridge
// 4. Custom WebSocket cluster

class HighScaleRealtime {
  private redis: Redis
  private pubsub: Redis
  
  async publish(channel: string, message: any) {
    await this.pubsub.publish(channel, JSON.stringify(message))
  }
  
  async subscribe(channel: string, callback: (message: any) => void) {
    await this.pubsub.subscribe(channel, (err, count) => {
      if (err) console.error('Subscription error:', err)
    })
    
    this.pubsub.on('message', (channel, message) => {
      callback(JSON.parse(message))
    })
  }
}
```

### 4. User Scale: 100,000+ Concurrent Users

**Enterprise Architecture:**

#### Microservices Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  Auth Service   │    │  Chat Service   │
│   (Kong/Nginx)  │    │   (JWT/OAuth)   │    │  (Messages)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Voice Service  │    │ Presence Service│    │  File Service   │
│   (SFU/WebRTC)  │    │   (Redis)       │    │  (S3/Storage)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Database Architecture
- **Primary Database**: PostgreSQL with read replicas
- **Caching Layer**: Redis Cluster
- **Search**: Elasticsearch for message search
- **Analytics**: ClickHouse for user analytics
- **File Storage**: S3-compatible storage

#### Infrastructure
- **Container Orchestration**: Kubernetes
- **Service Mesh**: Istio
- **Load Balancing**: HAProxy/Envoy
- **CDN**: Cloudflare/AWS CloudFront
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

## Performance Optimization

### Frontend Optimizations
```typescript
// Implement virtual scrolling for large message lists
import { FixedSizeList as List } from 'react-window'

const MessageList = ({ messages }: { messages: Message[] }) => (
  <List
    height={600}
    itemCount={messages.length}
    itemSize={80}
    itemData={messages}
  >
    {({ index, style, data }) => (
      <MessageItem
        message={data[index]}
        style={style}
      />
    )}
  </List>
)

// Implement message pagination
const useMessagePagination = (channelId: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    const newMessages = await fetchMessages(channelId, messages[0]?.id)
    setMessages(prev => [...newMessages, ...prev])
    setHasMore(newMessages.length === 50)
    setLoading(false)
  }, [channelId, messages, loading, hasMore])
  
  return { messages, hasMore, loading, loadMore }
}
```

### Database Optimizations
```sql
-- Implement message archiving
CREATE TABLE messages_archive (
  LIKE messages INCLUDING ALL
);

-- Archive old messages (older than 30 days)
INSERT INTO messages_archive 
SELECT * FROM messages 
WHERE created_at < NOW() - INTERVAL '30 days';

DELETE FROM messages 
WHERE created_at < NOW() - INTERVAL '30 days';

-- Implement full-text search
CREATE INDEX messages_content_fts 
ON messages USING gin(to_tsvector('english', content));

-- Add message search function
CREATE OR REPLACE FUNCTION search_messages(
  search_query text,
  channel_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  user_id uuid,
  created_at timestamptz,
  rank float
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.content,
    m.user_id,
    m.created_at,
    ts_rank(to_tsvector('english', m.content), plainto_tsquery('english', search_query)) as rank
  FROM messages m
  WHERE 
    (channel_id IS NULL OR m.channel_id = channel_id)
    AND to_tsvector('english', m.content) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, m.created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;
```

## Monitoring & Alerting

### Key Metrics to Monitor
```typescript
// Application metrics
interface AppMetrics {
  // User metrics
  activeUsers: number
  concurrentConnections: number
  messageRate: number // messages per second
  
  // Performance metrics
  apiResponseTime: number
  databaseQueryTime: number
  memoryUsage: number
  cpuUsage: number
  
  // Error metrics
  errorRate: number
  failedRequests: number
  timeoutRate: number
}

// Voice metrics
interface VoiceMetrics {
  activeRooms: number
  participantsPerRoom: number
  audioQuality: number // MOS score
  connectionSuccessRate: number
  bandwidthUsage: number
}
```

### Alerting Rules
```yaml
# prometheus-alerts.yml
groups:
  - name: bonfire-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: DatabaseSlowQueries
        expr: histogram_quantile(0.95, database_query_duration_seconds) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Database queries are slow"
          
      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"
```

## Cost Optimization

### Infrastructure Costs (Monthly Estimates)

| Component | 1K Users | 10K Users | 100K Users |
|-----------|----------|-----------|------------|
| Supabase Pro | $25 | $599 | $2,500 |
| Netlify Pro | $19 | $99 | $99 |
| Redis Cloud | $15 | $50 | $200 |
| SFU Server | $50 | $200 | $1,000 |
| CDN | $20 | $100 | $500 |
| **Total** | **$129** | **$1,048** | **$4,299** |

### Optimization Strategies
1. **Implement message retention policies** (delete old messages)
2. **Use CDN for static assets** (avatars, server icons)
3. **Optimize image sizes** (WebP format, responsive images)
4. **Implement connection pooling** (reduce database connections)
5. **Use edge caching** (cache frequently accessed data)

## Migration Checklist

### Phase 1: Foundation (1K-10K users)
- [ ] Set up monitoring and alerting
- [ ] Implement Redis for rate limiting
- [ ] Add database indexes
- [ ] Set up backup and recovery procedures
- [ ] Implement proper error handling

### Phase 2: Performance (10K-100K users)
- [ ] Migrate to SFU for voice
- [ ] Implement message pagination
- [ ] Add caching layer
- [ ] Set up read replicas
- [ ] Implement message archiving

### Phase 3: Scale (100K+ users)
- [ ] Implement microservices architecture
- [ ] Set up Kubernetes cluster
- [ ] Implement database sharding
- [ ] Add CDN and edge caching
- [ ] Set up advanced monitoring

## Conclusion

The current Bonfire architecture can handle up to 1,000 concurrent users with minimal changes. For larger scale, the key inflection points are:

1. **1,000 users**: Add Redis and proper monitoring
2. **10,000 users**: Migrate voice to SFU architecture
3. **100,000 users**: Implement microservices and sharding

The modular design allows for incremental scaling without major rewrites. Start with monitoring and optimization, then add infrastructure as needed.
