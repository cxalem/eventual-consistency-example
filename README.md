# Real-Time Data Feed Simulation API

## Problem Statement

This API simulates a real-time data feed system that mimics database replication with network delays and different operational states. The system models a common enterprise scenario where data flows through multiple stages with varying latencies.

## Architecture Overview

```
┌─────────┐    30s    ┌─────────┐   0-5min   ┌─────────┐          ┌─────────┐
│ Feed A  │ ────────► │ Delay B │ ─────────► │  Boot   │ ────────►│  Live   │
│(Source) │           │(Replica)│  (random)  │(Buffer) │          │(Reader) │
└─────────┘           └─────────┘            └─────────┘          └─────────┘
```

## Data Flow

### 1. Feed A (Data Source)
- **Purpose**: Simulates the primary data source
- **Behavior**: Generates new records every 30 seconds
- **Data Structure**: `{ id: string, timestamp: number }`
- **Implementation**: `src/services/feedA.ts`

### 2. Delay B (Replica with Lag)
- **Purpose**: Simulates database replication with network delays
- **Behavior**: Receives data from Feed A and forwards it with random delay
- **Delay Range**: 0 to 5 minutes (random)
- **Implementation**: `src/services/delayB.ts`

### 3. Boot Service (Data Buffer)
- **Purpose**: Manages data accumulation and state transitions
- **Behavior**: 
  - Accumulates data from Delay B
  - Triggers state change from BOOT to LIVE after first data load
  - Provides on-demand data access
- **Implementation**: `src/services/boot.ts`

### 4. Live Service (Data Reader)
- **Purpose**: Provides live data access with polling restrictions
- **Behavior**: Polls Boot service every 30 seconds after initial load
- **Implementation**: `src/services/live.ts`

## Application States

The system operates in two distinct states:

### BOOT State
- **Initial state** when the application starts
- **Behavior**: 
  - Bypasses polling restrictions
  - Loads data as soon as possible
  - Automatically transitions to LIVE state after first successful data load
- **Use Case**: Initial data loading and system startup

### LIVE State
- **Operational state** after successful boot
- **Behavior**:
  - Enforces polling rules (30-second intervals)
  - No polling failures allowed
  - Requests data at regular intervals
- **Use Case**: Normal runtime operations

## Key Features

### Real-Time Simulation
- **30-second data generation** from primary source
- **Random replication delays** up to 5 minutes
- **Event-driven architecture** using EventEmitter pattern

### State Management
- **Automatic state transitions** based on data availability
- **Centralized state management** in `src/states.ts`
- **State-aware behavior** in different services

### Robust Data Handling
- **Asynchronous data processing** with proper Promise handling
- **Event-based communication** between services
- **Error handling** with state fallback mechanisms

## Implementation Details

### Service Architecture
```typescript
// Feed A: Primary data source
class FeedA extends EventEmitter {
  // Generates records every 30 seconds
  // Emits "new" events with data
}

// Delay B: Replication with lag
class DelayB extends EventEmitter {
  // Receives from Feed A
  // Adds random delay (0-5 minutes)
  // Emits "ready" events
}

// Boot: Data accumulation and state management
class Boot extends EventEmitter {
  // Accumulates data from Delay B
  // Manages BOOT → LIVE transition
  // Provides getData() method
}

// Live: Polling service with rules
class Live extends EventEmitter {
  // Polls Boot service every 30 seconds
  // Emits "data_fetched" events
  // Respects state-based rules
}
```

### State Management
```typescript
type Modes = "BOOT" | "LIVE";

// Global state management
export function getMode(): Modes;
export function setMode(newMode: Modes): void;
```

## Usage

### Starting the System
```typescript
import express from "express";
import live from "./services/live.js";

const app = express();

// Listen for live data updates
live.on("data_fetched", (data) => {
  console.log("Live data:", data);
});

app.listen(3000);
```

### Manual Data Access
```typescript
import boot from "./services/boot.js";

// Get current data (waits for first load if needed)
const currentData = await boot.getData();
```

## Project Structure

```
src/
├── index.ts              # Main application entry point
├── states.ts             # Global state management
├── services/
│   ├── feedA.ts         # Primary data source
│   ├── delayB.ts        # Replication with lag
│   ├── boot.ts          # Data buffer and state management
│   └── live.ts          # Live data reader
└── routes/              # API routes (if any)
```

## Technical Specifications

- **Language**: TypeScript
- **Runtime**: Node.js with Express
- **Pattern**: Event-driven architecture
- **State Management**: Centralized with type safety
- **Async Handling**: Promise-based with proper error handling

## Use Cases

This simulation is ideal for:
- **Testing replication lag scenarios**
- **Modeling real-time data systems**
- **Understanding event-driven architectures**
- **Simulating database synchronization delays**
- **Testing state-based application behavior**

## Development

### Prerequisites
- Node.js 18+
- TypeScript 5+
- Express.js

### Installation
```bash
pnpm i
```

### Running
```bash
pnpm dev
```

The system will automatically:
1. Start in BOOT state
2. Begin generating data every 30 seconds
3. Apply random delays to simulate network lag
4. Transition to LIVE state after first data load
5. Begin regular polling at 30-second intervals

## Eventual Consistency Model

This implementation demonstrates the **Eventual Consistency** concept from distributed systems theory.

### How It Satisfies Eventual Consistency

#### ✅ **Core Principles:**

1. **Temporary Inconsistency**: 
   - Feed A (primary) has data immediately
   - Delay B (replica) won't have the same data for 0-5 minutes
   - During this window, the systems are inconsistent

2. **Guaranteed Convergence**:
   - All data from Feed A eventually reaches Delay B
   - No data is lost, just delayed
   - Eventually, both systems will have the same data

3. **Asynchronous Updates**:
   - Feed A doesn't wait for Delay B to acknowledge
   - Updates flow through the system asynchronously
   - No blocking or synchronous replication

### Real-World Parallels

This implementation mirrors common distributed systems patterns:
- **Master-Slave database replication**
- **CDN cache propagation**
- **Distributed cache invalidation**
- **Microservices eventual consistency**

### Consistency Timeline Example

```
Time 0:00 - Feed A generates record {id: "abc123", ts: 1640995200}
Time 0:00 - Delay B: No data yet (inconsistent)
Time 0:00 - Boot/Live: No data yet (inconsistent)

Time 2:30 - Random delay completes
Time 2:30 - Delay B: Now has {id: "abc123", ts: 1640995200}
Time 2:30 - Boot/Live: Now has the data (consistent!)

Result: Eventual consistency achieved after 2.5 minutes
```

### CAP Theorem Alignment

This system demonstrates the **CAP Theorem** trade-offs:

- **Consistency**: ❌ Not immediate (temporary inconsistency allowed)
- **Availability**: ✅ Feed A always available, Delay B eventually available
- **Partition Tolerance**: ✅ System continues operating despite delays

### BASE Properties

The implementation follows **BASE** (alternative to ACID):

- **Basically Available**: System remains operational during delays
- **Soft State**: Data state changes over time as updates propagate
- **Eventual Consistency**: All nodes will eventually converge to the same state

### Comparison to Distributed Systems

#### **What This Implementation Has:**
- ✅ **Asynchronous propagation**
- ✅ **Temporary inconsistency windows**
- ✅ **Guaranteed eventual convergence**
- ✅ **No data loss**

#### **What Real Systems Add:**
- **Network partitions** (assumes network always works)
- **Conflict resolution** (when multiple sources update same data)
- **Quorum consensus** (requiring majority agreement)
- **Vector clocks** (tracking causality across nodes)

### Educational Value

This simulation is perfect for understanding:
- **Distributed systems trade-offs**
- **Replication lag in practice**
- **Event-driven consistency models**
- **Asynchronous data propagation**
- **State management in distributed environments**

The implementation provides a concrete, observable example of how eventual consistency works in practice, making abstract distributed systems concepts tangible and understandable. 