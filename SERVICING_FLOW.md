# A to Z Servicing Flow Documentation

## Overview
This document outlines the complete servicing flow in the Queue App, from customer token generation to completion, including admin/merchant panel checks. The flow is implemented in the React Native app, with backend API interactions.

## Key Components
- **Frontend**: React Native app (Servicing.js screen)
- **Backend**: API endpoints (apiService.js)
- **Roles**: Customer, Merchant/Admin, Desk Operator

## A to Z Servicing Flow

### 1. Queue Setup (Admin/Merchant Panel)
- **Merchant creates a queue** via app screens (e.g., CreateQueue steps in Merchant folder)
- **Assign categories and desks** to the queue
- **API Calls**:
  - `createQueue(queueData)`
  - `createDesk(data)`
  - `getCategories()`

### 2. Customer Token Generation
- **Customer selects queue and category** in the app
- **Generates token** via API
- **API Calls**:
  - `generateToken({ queueId, categoryId })`
  - `getQueueDetails(queueId)`

### 3. Servicing Screen Initialization (Servicing.js)
- **Fetch queue data** on load:
  - Get servicing list (active tokens)
  - Get skipped tokens
  - Get current serving token
  - Get completed history
- **API Calls**:
  - `getServicingList(queueId, categoryId)`
  - `getSkippedList(queueId, categoryId)`
  - `getCurrentToken(queueId, categoryId)`
  - `getCompletedHistory(queueId, categoryId)`

### 4. Display Queue Status
- **Now Serving**: Current token being serviced
- **Last Issued**: Highest token number in queue
- **Customer List**: Upcoming customers with estimated wait times
- **Skipped Tokens**: List of skipped tokens with recover option
- **Completed History**: Today's served tokens

### 5. Servicing Actions
#### Call Next (Complete Token)
- **Mark current token as completed**
- **Announce next token via voice** (English announcement)
- **Update UI**: Move to next customer
- **API Call**: `completeToken(tokenId)`

#### Skip Tokens
- **Select customers to skip**
- **Move to skipped list**
- **API Call**: `getServicingSkip(tokenIds)`

#### Recover Skipped Token
- **Recover a skipped token back to active queue**
- **API Call**: `recoverSkippedToken(tokenNumber)`

### 6. Real-time Updates
- **Auto-refresh** every 8 seconds for current token and history
- **Voice Announcements** for next token calls

## 7. Admin/Merchant Panel Checks
- **MyQueue Screen** (`app/screens/Merchant/My Queue/MyQueue.js`):
  - Displays list of queues created by merchant
  - Shows queue details: name, category, start date, desks, token count
  - Filters by status (all, running, cancelled)
  - Refresh functionality to update token counts
  - Add new queue button
  - API Calls: `getQueueList()`, `getTokenCounts()`, `getCategories()`

- **DeskList Screen** (`app/screens/Merchant/Desk/DeskList.js`):
  - Lists all desks for the merchant
  - Shows desk details: name, category, email, status (active/inactive)
  - Actions: Edit, Delete desk
  - Add new desk FAB button
  - Refresh control for updates
  - API Calls: `getDeskList()`, `deleteDesk()`

- **Other Admin Screens**:
  - CreateQueue (Step1-4): Setup new queues
  - Business management: Create/manage business branches
  - Profile management for merchants

- **Monitoring Capabilities**:
  - Real-time token counts per queue
  - Queue status tracking
  - Desk assignment and management
  - Category-based organization

## Flow Diagram (Text-based)

```
Customer App:
1. Select Queue/Category → Generate Token

Merchant/Admin Panel:
1. Create/Manage Queues
2. Assign Desks/Categories
3. Monitor Queue Status

Servicing Screen (Operator):
1. Load Queue Data
2. Display Now Serving / Queue List
3. Actions: Next / Skip / Recover
4. Auto-updates and Announcements

Backend API:
- Token Management (Generate, Complete, Skip, Recover)
- Queue Management (Create, List, Details)
- History and Counts
```

## Error Handling
- Toast messages for success/error notifications
- Fallbacks for missing queue/category IDs
- API error logging and user alerts

## Dependencies
- React Native components (FlatList, TouchableOpacity, etc.)
- Axios for API calls
- Redux for state management (auth user)
- Speech library for voice announcements

## Testing Checklist
- [ ] Token generation works
- [ ] Servicing screen loads correctly
- [ ] Next/Skip actions update queue
- [ ] Voice announcements trigger
- [ ] History updates in real-time
- [ ] Admin panel reflects changes
- [ ] Error scenarios handled (empty queue, API failures)

## Notes
- Base URL: Configured in Environment.js (currently http://192.168.2.50:8008)
- Authentication: Bearer token in API headers
- Refresh intervals: 8 seconds for updates
