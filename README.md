# YTBlogX

Build a web app that takes a YouTube video link, fetches its transcript via an API, splits the transcript into meaningful parts, and generates a blog post for each part.

# MVP Features

MVP Features:

1. YouTube Link Input: Simple field to paste a YouTube video URL.
2. Transcript Fetching: Use YouTube API to get video transcripts.
3. Transcript Splitting: Automatically break the transcript into parts.
4. Blog Generation: Generate draft blog posts for each part using basic AI summarization.
5. Preview & Edit: Display generated blogs with the option to edit text.
6. Download/Copy: Allow users to copy or download the blog drafts.
7. Error Handling: Show clear messages for invalid links or missing transcripts.

# UI Routes

/ : landing page explaining the project
/dashboard : already processed videos whose blogs have been generated with their thumbnail and title
/dashboard : also have the yt input video
Once someone enters yt video link their blog gets generated and saved and yt video is added to the dashboard.
/video/:videoId :
Shows the video details (thumbnail, title, etc.).
Lists all generated blogs — just titles with short previews — as clickable cards or links.
Clicking a blog takes the user to the blog's detailed view.
/video/:videoId/blog/:blogId Page:
Displays the full blog content.
Includes a button or tab to view the corresponding transcript — maybe as a collapsible section or side panel.

# Schema

model User {
id String @id @default(uuid())
name String?
email String @unique
image String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

videos Video[]
}

model Video {
id String @id @default(uuid())
userId String
title String
thumbnailUrl String
youtubeUrl String
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id])
blogs Blog[]
}

model Blog {
id String @id @default(uuid())
videoId String
title String
content String
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

video Video @relation(fields: [videoId], references: [id])
transcripts Transcript[]
}

model Transcript {
id String @id @default(uuid())
blogId String
text String
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

blog Blog @relation(fields: [blogId], references: [id])
}

# Schema Design

1.  Add YouTube Video & Generate Blogs
    Route: POST /api/videos
    Purpose: Takes a YouTube link, fetches the transcript, splits it, and generates blog drafts.
    Request Body:
    {
    "youtubeUrl": "https://www.youtube.com/watch?v=example"
    }
    Response:
    {
    "videoId": "abc123",
    "title": "Video Title",
    "thumbnailUrl": "https://img.youtube.com/...",
    "blogCount":3
    }
    UI Trigger:
    Called from /dashboard when user submits a YouTube link.
    just add the response to the array

2.  Get All Videos (Dashboard)
    Route: GET /api/videos
    Purpose: Fetch all videos for the current user.
    Response:
    [
    {
    "id": "abc123",
    "title": "Video Title",
    "thumbnailUrl": "https://img.youtube.com/...",
    "blogsCount": 3
    }
    ]
    UI Trigger:
    On /dashboard load — shows processed videos with thumbnails.

3.  Get Video Details & Blogs
    Route: GET /api/videos/:videoId
    Purpose: Fetch video details and associated blogs.
    Response:

    {
    "id": "abc123",
    "title": "Video Title",
    "blogs": [
    { "id": "blog1", "title": "Blog Part 1", "content": "..." },
    { "id": "blog2", "title": "Blog Part 2", "content": "..." }
    ]
    }
    UI Trigger:
    On /video/:videoId load — shows blogs linked to a video.

4.  Get Blog & Transcript
    Route: GET /api/blogs/:blogId
    Purpose: Fetch a blog's full content and its transcript.
    Response:
    json
    Copy
    Edit
    {
    "id": "blog1",
    "title": "Blog Part 1",
    "content": "...",
    "transcript": "Full transcript part here..."
    }
    UI Trigger:
    On /video/:videoId/blog/:blogId load — displays blog with "View Transcript" option.

5.  Delete a Video
    Route: DELETE /api/videos/:videoId
    Purpose: Removes a video and all associated blogs and transcripts.
    UI Trigger:
    From /dashboard if you add a "Delete" button.

I want to tell user about three features of my web app :
📹 YouTube Integration — Fetch transcripts with one link.
✂️ Smart Splitting — Break long transcripts into meaningful blog sections.
✨ AI Summaries — Generate easy-to-read blog drafts for each part.
I want you to build three different Feature Section by taking inspiration from SAAS
make each of the different UI one tab option
