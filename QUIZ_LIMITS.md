# Daily Generation Limits

This document outlines the daily generation limits implemented across all features to ensure fair usage of the AI-powered generation system.

## Constraints Implemented

### 1. Universal Daily Generation Limit
- **Limit**: 10 generations per user per day (across all features)
- **Scope**: Covers quizzes, summaries, flashcards, flowcharts, and translations
- **Reset**: Automatically resets at midnight local time (00:00:00)
- **Tracking**: Stored in Firestore user document with `dailyGenerationCount` and `lastGenerationDate` fields

### 2. Quiz Submission Limit
- **Limit**: 5 submissions per quiz
- **Scope**: Per individual quiz (each quiz can have up to 5 attempts)
- **Tracking**: Tracked via `total_submissions` field in quiz document

## User Experience

### All Generation Pages (Quiz, Summary, Flashcard, Flowchart, Translation)
- **Limit Display**: Shows remaining daily generation count in the header
- **Warning Messages**: Displays alert when daily generation limit is reached
- **Disabled UI**: Generate buttons are disabled when limit is exceeded
- **Visual Feedback**: Different button states for normal, loading, and limit-reached states
- **Consistent Messaging**: All features show the same "10 items per day across all features" message

### Quiz Taking Page
- **Submission Counter**: Shows remaining submissions for current quiz
- **Warning Banner**: Displays when maximum submissions are reached
- **Disabled Actions**: Submit and Retake buttons disabled when limit exceeded
- **Clear Messaging**: Informative messages about submission limits

## Technical Implementation

### Files Modified/Created

1. **`/src/services/interfaces/interface.tsx`**
   - Added `dailyGenerationCount` and `lastGenerationDate` fields to `userData` interface
   - Removed legacy `dailyQuizCount` and `lastQuizDate` fields
   - Added Firestore Timestamp support

2. **`/src/services/firebaseFunctions/limits.tsx`** (Enhanced)
   - `checkDailyGenerationLimit()`: Checks if user can create more generations today (universal limit)
   - `updateDailyGenerationCount()`: Increments daily generation count after successful creation
   - `checkDailyQuizLimit()`: Backward compatibility wrapper (now uses universal limit)
   - `updateDailyQuizCount()`: Backward compatibility wrapper (now uses universal limit)
   - `checkQuizSubmissionLimit()`: Checks if quiz can accept more submissions
   - `getTodayDateString()`: Helper for consistent date formatting and midnight reset
   - `isNewDay()`: Helper to determine if it's a new day for limit reset
   - `LIMITS` constants for easy configuration

3. **Updated Generation Pages**
   - **`/src/app/generator/page.tsx`**: Quiz generator with universal limits
   - **`/src/app/summariser/page.tsx`**: Summary generator with universal limits
   - **`/src/app/flashcard/page.tsx`**: Flashcard generator with universal limits
   - **`/src/app/flowchart/page.tsx`**: Flowchart generator with universal limits
   - **`/src/app/translator/page.tsx`**: Translation generator with universal limits

### Database Schema Changes

#### Users Collection
```typescript
{
  id: string,
  username: string,
  email: string,
  joined: Date,
  dailyGenerationCount?: number,   // Universal field for all daily generations
  lastGenerationDate?: Date,       // Universal field for last generation date
  // ... other fields
}
```

## Configuration

The limits are defined in `/src/services/firebaseFunctions/limits.tsx`:

```typescript
const DAILY_GENERATION_LIMIT = 10;  // Universal daily limit for all features
const MAX_QUIZ_SUBMISSIONS = 5;     // Per-quiz submission limit
```

These can be easily modified to change the constraints.

## Midnight Reset Implementation

The system implements a proper midnight reset using:

```typescript
function getTodayDateString(): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset to midnight
  return now.toISOString().split('T')[0]; // YYYY-MM-DD format
}

function isNewDay(lastDate: Date | Timestamp | null): boolean {
  if (!lastDate) return true;
  
  const lastDateString = lastDate instanceof Timestamp ? 
    lastDate.toDate().toISOString().split('T')[0] : 
    new Date(lastDate).toISOString().split('T')[0];
  
  return lastDateString !== getTodayDateString();
}
```

This ensures limits reset exactly at midnight (00:00:00) local time.

## Generation Type Tracking

When a generation is successful, the system calls:
```typescript
await updateDailyGenerationCount(userId, generationType);
```

Where `generationType` can be:
- `'quiz'` - Quiz generation
- `'summary'` - Summary generation
- `'flashcard'` - Flashcard generation
- `'flowchart'` - Flowchart generation
- `'translation'` - Translation generation

## Error Handling

- **Network Errors**: Graceful degradation with console logging
- **Database Errors**: Fallback to restrictive behavior (deny access) when limits can't be checked
- **User Feedback**: Clear alert messages explaining why actions are blocked

## Future Enhancements

1. **Admin Override**: Allow administrators to bypass or adjust limits for specific users
2. **Premium Tiers**: Different limits based on subscription level
3. **Usage Analytics**: Dashboard showing usage patterns and limit effectiveness across all features
4. **Time Zone Handling**: More sophisticated timezone-aware daily resets
5. **Feature-Specific Limits**: Individual limits for each generation type while maintaining universal cap
6. **Bulk Operations**: Special handling for educational institutions with higher limits
