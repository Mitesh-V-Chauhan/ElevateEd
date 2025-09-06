# Quiz Generation and Submission Limits

This document outlines the daily and per-quiz limits implemented to ensure fair usage of the quiz generation system.

## Constraints Implemented

### 1. Daily Quiz Generation Limit
- **Limit**: 5 quizzes per user per day
- **Reset**: Automatically resets at midnight (based on user's local timezone)
- **Tracking**: Stored in Firestore user document with `dailyQuizCount` and `lastQuizDate` fields

### 2. Quiz Submission Limit
- **Limit**: 5 submissions per quiz
- **Scope**: Per individual quiz (each quiz can have up to 5 attempts)
- **Tracking**: Tracked via `total_submissions` field in quiz document

## User Experience

### Quiz Generation Page
- **Limit Display**: Shows remaining daily quiz count in the header
- **Warning Messages**: Displays alert when daily limit is reached
- **Disabled UI**: Generate button is disabled when limit is exceeded
- **Visual Feedback**: Different button states for normal, loading, and limit-reached states

### Quiz Taking Page
- **Submission Counter**: Shows remaining submissions for current quiz
- **Warning Banner**: Displays when maximum submissions are reached
- **Disabled Actions**: Submit and Retake buttons disabled when limit exceeded
- **Clear Messaging**: Informative messages about submission limits

## Technical Implementation

### Files Modified/Created

1. **`/src/services/interfaces/interface.tsx`**
   - Added `dailyQuizCount` and `lastQuizDate` fields to `userData` interface
   - Added Firestore Timestamp support

2. **`/src/services/firebaseFunctions/limits.tsx`** (New File)
   - `checkDailyQuizLimit()`: Checks if user can create more quizzes today
   - `updateDailyQuizCount()`: Increments daily quiz count after successful creation
   - `checkQuizSubmissionLimit()`: Checks if quiz can accept more submissions
   - `LIMITS` constants for easy configuration

3. **`/src/app/generator/page.tsx`**
   - Added limit checking hooks and state management
   - Enhanced UI with limit displays and warnings
   - Implemented constraint enforcement in quiz generation and submission flows

### Database Schema Changes

#### Users Collection
```typescript
{
  id: string,
  username: string,
  email: string,
  joined: Date,
  dailyQuizCount?: number,     // New field
  lastQuizDate?: Date,         // New field
  // ... other fields
}
```

## Configuration

The limits are defined in `/src/services/firebaseFunctions/limits.tsx`:

```typescript
const DAILY_QUIZ_LIMIT = 5;
const MAX_QUIZ_SUBMISSIONS = 5;
```

These can be easily modified to change the constraints.

## Error Handling

- **Network Errors**: Graceful degradation with console logging
- **Database Errors**: Fallback to restrictive behavior (deny access) when limits can't be checked
- **User Feedback**: Clear alert messages explaining why actions are blocked

## Future Enhancements

1. **Admin Override**: Allow administrators to bypass or adjust limits for specific users
2. **Premium Tiers**: Different limits based on subscription level
3. **Usage Analytics**: Dashboard showing usage patterns and limit effectiveness
4. **Time Zone Handling**: More sophisticated timezone-aware daily resets
5. **Bulk Operations**: Special handling for educational institutions with higher limits
