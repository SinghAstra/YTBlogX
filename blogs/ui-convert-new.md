Let's build the UI for the /convert/new page where users will input YouTube videos for conversion. I'll break this down into sections and components.

Page Layout Structure:

1. Header Section

   - Navigation bar with logo and auth status
   - Progress indicator showing "Step 1 of 3: Video Details"

2. Main Conversion Section (Central Focus)

   - Large, prominent input field for YouTube URL
   - Paste button with clipboard icon
   - "Convert" button (prominent, primary color)
   - Optional: URL validation indicator
   - Preview card that appears after valid URL entry showing:
     - Video thumbnail
     - Title
     - Channel name
     - Duration
     - View count

3. Customization Options Panel

   - Blog format preferences:
     - Writing style (Technical/Casual/Detailed)
     - Include code snippets (if programming video)
     - Include screenshots from video
     - Target word count range
   - Output language selection

Visual Hierarchy:

1. URL input (largest, centered)
2. Preview card (appears below input)
3. Customization panel (collapsible, right side)
4. Recent conversions (bottom grid)

Interactive Elements:

- URL field should auto-detect YouTube links from clipboard
- Real-time URL validation with visual feedback
- Preview card slides in smoothly after valid URL
- Customization panel can expand/collapse
- Tooltips for option explanations

Mobile Considerations:

- Stack elements vertically
- Collapse customization into expandable accordion
- Full-width input and buttons
- Simplified preview card
- Hide recent conversions behind a tab/scroll
