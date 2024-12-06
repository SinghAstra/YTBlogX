Here's a minimal UI route structure for the YouTube to Blog Post Generator MVP:

1. Home Page (/)

- Goal: Landing page with primary value proposition
- Key Elements:
  - Large, centered URL input field
  - "Generate Blog Post" button
  - Brief explanation of how the tool works
  - Optional: Quick example or demo

2. Generate Page (/generate)

- Goal: Process the YouTube URL and display generated blog post
- Key Elements:
  - Input field (prefilled with URL from previous page)
  - Generate button
  - Loading state
  - Generated blog post display
  - Copy and Edit buttons

3. History Page (/history)

- Goal: Track and manage previously generated blog posts
- Key Elements:
  - List of generated blog posts
  - Search/filter functionality
  - Option to delete or regenerate posts

4. Settings Page (/settings)

- Goal: Configure basic application preferences
- Key Elements:
  - API key management
  - Language selection
  - Tone/style preferences
  - Default output format

5. Error Page (404)

- Goal: Handle invalid routes
- Key Elements:
  - Friendly error message
  - Return to home page button

Optional Advanced Routes:

- /export (for exporting blog posts)
- /upgrade (for potential premium features)

The core user journey would be:

1. Land on homepage
2. Enter YouTube URL
3. Generate blog post
4. View, copy, or edit result
