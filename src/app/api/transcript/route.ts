import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

interface VideoInfo {
  title: string;
  duration: string;
}

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Fetch transcript
    const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcriptArray || transcriptArray.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No transcript found for this video' },
        { status: 404 }
      );
    }

    // Combine transcript text
    const transcript = transcriptArray
      .map((item: { text: string }) => item.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Fetch video info (title and duration)
    let videoInfo: VideoInfo | null = null;
    try {
      const videoInfoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,contentDetails`
      );
      
      if (videoInfoResponse.ok) {
        const videoData = await videoInfoResponse.json();
        if (videoData.items && videoData.items.length > 0) {
          const video = videoData.items[0];
          videoInfo = {
            title: video.snippet.title,
            duration: formatDuration(video.contentDetails.duration)
          };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch video info:', error);
      // Continue without video info if API fails
    }

    return NextResponse.json({
      success: true,
      transcript,
      videoInfo
    });

  } catch (error) {
    console.error('Error fetching transcript:', error);
    
    let errorMessage = 'Failed to fetch transcript';
    if (error instanceof Error) {
      if (error.message.includes('Transcript is disabled')) {
        errorMessage = 'Transcript is disabled for this video';
      } else if (error.message.includes('Video unavailable')) {
        errorMessage = 'Video is unavailable or private';
      } else if (error.message.includes('No transcript found')) {
        errorMessage = 'No transcript available for this video';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// Helper function to format ISO 8601 duration to readable format
function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return duration;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}