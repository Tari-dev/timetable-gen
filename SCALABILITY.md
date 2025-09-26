# Timetable Generator - Scalability Analysis

## System Architecture

The Timetable Generator is a full-stack web application built with:

### Frontend
- **Framework**: React 19 with Vite
- **UI**: TailwindCSS for styling
- **Architecture**: Single Page Application (SPA)
- **Build Tool**: Vite with hot module replacement

### Backend
- **Framework**: FastAPI (Python)
- **Solver Engine**: Google OR-Tools CP-SAT solver
- **API**: RESTful API with CORS enabled
- **Deployment**: Uvicorn ASGI server

## Current Scalability Characteristics

### Computational Complexity
- **Algorithm**: Constraint Programming using CP-SAT solver
- **Time Complexity**: NP-hard problem with exponential worst-case complexity
- **Current Limits**: 15-second timeout per timetable generation
- **Solver Configuration**: 8 parallel search workers

### Performance Bottlenecks

#### 1. Solver Performance
- **Primary Bottleneck**: OR-Tools constraint solver execution time
- **Scaling Factor**: O(C × T × S) where C=courses, T=timeslots, S=students
- **Current Configuration**: Single-threaded per request with 8 solver workers
- **Memory Usage**: Grows quadratically with problem size

#### 2. Request Processing
- **Architecture**: Synchronous request processing
- **Blocking Operations**: Each timetable generation blocks the thread
- **No Request Queuing**: No built-in request queue management
- **Session Management**: Stateless API calls

#### 3. Data Handling
- **In-Memory Processing**: All data processed in RAM
- **No Persistence**: No database for storing generated timetables
- **File I/O**: CSV output written to local filesystem

## Scalability Limitations

### Current Scale Estimates
- **Small Scale** (✅ Handles Well):
  - Courses: 5-15
  - Students: 20-100
  - Faculty: 5-20
  - Timeslots: 20-40

- **Medium Scale** (⚠️ Performance Degradation):
  - Courses: 15-50
  - Students: 100-500
  - Faculty: 20-100
  - Timeslots: 40-100

- **Large Scale** (❌ Likely Timeout/Failure):
  - Courses: 50+
  - Students: 500+
  - Faculty: 100+
  - Timeslots: 100+

### Key Limitations
1. **15-second timeout** may be insufficient for complex problems
2. **Single-server architecture** with no horizontal scaling
3. **No caching** of previously computed solutions
4. **Synchronous processing** blocks concurrent requests
5. **Memory constraints** for large constraint models

## Scaling Strategies

### Immediate Improvements (Low Effort)

#### 1. Timeout & Solver Optimization
```python
# Increase timeout for larger problems
solver.parameters.max_time_in_seconds = min(300, complexity_estimate * 5)

# Tune solver parameters
solver.parameters.preferred_variable_order = cp_model.CHOOSE_LOWEST_MIN
solver.parameters.search_branching = cp_model.FIXED_SEARCH
```

#### 2. Request Queuing
- Implement background task queue (Celery + Redis)
- Add request status endpoints
- Return job IDs for async processing

#### 3. Basic Caching
- Cache solutions for identical input data
- Use Redis for distributed caching
- Implement cache invalidation strategies

### Medium-term Scaling (Moderate Effort)

#### 1. Horizontal Scaling
- **Load Balancer**: Nginx/HAProxy for request distribution
- **Multi-instance Deployment**: Docker containers with orchestration
- **Database Integration**: PostgreSQL for persistence
- **Microservices**: Separate solver service from API

#### 2. Problem Decomposition
- **Temporal Decomposition**: Generate timetables by day/semester
- **Hierarchical Solving**: Major courses first, electives second
- **Constraint Relaxation**: Soft constraint handling for feasibility

#### 3. Advanced Algorithms
- **Heuristic Pre-processing**: Constraint propagation before solving
- **Meta-heuristics**: Genetic algorithms or simulated annealing
- **Incremental Solving**: Modify existing timetables vs. regenerating

### Long-term Architecture (High Effort)

#### 1. Distributed Solving
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │  Solver Cluster │    │   Result Cache  │
│                 │    │                 │    │                 │
│   Nginx/HAProxy │───▶│ Worker Node 1   │───▶│ Redis Cluster   │
│                 │    │ Worker Node 2   │    │                 │
│                 │    │ Worker Node N   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### 2. Cloud-Native Architecture
- **Container Orchestration**: Kubernetes
- **Auto-scaling**: Based on queue depth and CPU utilization
- **Service Mesh**: Istio for traffic management
- **Event-Driven**: Message queues for async communication

#### 3. Advanced Optimizations
- **GPU Acceleration**: CUDA-enabled constraint solving
- **ML-Based Preprocessing**: Neural networks for constraint reduction
- **Streaming Solutions**: WebSocket for real-time progress updates

## Monitoring & Metrics

### Key Performance Indicators
- **Solver Time**: P95/P99 solving duration
- **Success Rate**: Feasible solutions percentage
- **Queue Depth**: Pending requests count
- **Resource Usage**: CPU/Memory utilization
- **Problem Complexity**: Variables/constraints per request

### Alerting Thresholds
- Solver timeout rate > 10%
- Average response time > 30s
- Queue depth > 100 requests
- Memory usage > 80%

## Deployment Recommendations

### Development Environment
- Current single-server setup adequate
- Docker Compose for local multi-service testing

### Production Environment (< 100 concurrent users)
- Single high-memory instance (16GB+ RAM)
- Redis for caching and queuing
- PostgreSQL for persistence
- Nginx reverse proxy

### Enterprise Environment (100+ concurrent users)
- Kubernetes cluster with auto-scaling
- Dedicated solver worker nodes
- Distributed caching layer
- Database clustering with read replicas
- CDN for static assets

## Cost Considerations

### Compute Costs
- **CPU-intensive**: Solver requires high-performance cores
- **Memory-intensive**: Large constraint models need significant RAM
- **Variable Load**: Peak usage during academic scheduling periods

### Scaling Economics
- **Vertical Scaling**: Diminishing returns beyond 32 cores
- **Horizontal Scaling**: Linear cost scaling with better fault tolerance
- **Cloud Costs**: On-demand instances for peak periods

## Conclusion

The current timetable generator handles small to medium educational institutions well. For larger organizations or commercial deployment, implementing the suggested scaling strategies will be essential. The constraint programming approach provides optimal solutions but requires careful architecture design for production scalability.