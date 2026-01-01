# Homepage Layout Feature

## Overview

This feature implements a 3-column homepage layout similar to Kinky.nl, with:
- **Left Sidebar**: Quick links to categories
- **Middle Section**: Performer profiles grid
- **Right Sidebar**: Trending videos

## Components Created

### 1. Quick Links Sidebar (`quick-links-sidebar.tsx`)
- Displays category links in a sidebar
- Categories included:
  - Vrouwen (Women)
  - Mannen (Men)
  - Stellen (Couples)
  - Shemales
  - Gay
  - BDSM Sex
  - Virtual Sex
  - Club
  - Privehuis (Private House)
  - Escortbureau (Escort Agency)
  - SM Studio's
  - Massage Salon

### 2. Trending Videos (`trending-videos.tsx`)
- Fetches and displays trending videos from the API
- Shows video thumbnail, title, performer info, views, and time ago
- Includes play button overlay on hover
- Displays video duration

### 3. Video Service (`video.service.ts`)
- New service to fetch videos from the API
- Endpoints:
  - `/user/assets/videos/search` - Search videos
  - `/user/assets/videos/:id` - Get video details

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Top Banner                            │
├──────────┬──────────────────────────┬───────────────────┤
│          │   Alle advertenties       │  Trending video's │
│ Quick    ├──────────────────────────┼───────────────────┤
│ Links    │                          │                   │
│          │   Performer Profiles      │  Video 1          │
│ - Vrouwen│   (Grid Layout)           │  Video 2          │
│ - Mannen │                          │  Video 3          │
│ - etc.   │                          │  Video 4          │
│          │                          │  Video 5          │
│          │                          │                   │
└──────────┴──────────────────────────┴───────────────────┘
│                    Bottom Banner                         │
└─────────────────────────────────────────────────────────┘
```

## Responsive Design

- **Desktop (>1024px)**: 3-column layout with sticky sidebars
- **Tablet (768px-1024px)**: Sidebars stack below main content
- **Mobile (<768px)**: Single column, all sections stack vertically

## Files Modified/Created

### New Files:
1. `user/src/components/common/quick-links-sidebar.tsx`
2. `user/src/components/common/quick-links-sidebar.less`
3. `user/src/components/common/trending-videos.tsx`
4. `user/src/components/common/trending-videos.less`
5. `user/src/services/video.service.ts`

### Modified Files:
1. `user/pages/home/index.tsx` - Updated layout structure
2. `user/pages/home/index.less` - Added 3-column layout styles
3. `user/src/services/index.ts` - Exported video service

## Features

- ✅ Responsive 3-column layout
- ✅ Sticky sidebars on desktop
- ✅ Quick category navigation
- ✅ Trending videos with thumbnails
- ✅ Video metadata (views, time ago, duration)
- ✅ Hover effects on videos
- ✅ Mobile-friendly stacking

## API Integration

The trending videos component uses:
- Endpoint: `GET /user/assets/videos/search`
- Parameters:
  - `limit`: Number of videos (default: 5)
  - `sort`: Sort order ('desc' or 'asc')
  - `sortBy`: Field to sort by ('createdAt', 'views', etc.)
  - `offset`: Pagination offset

## Customization

### Quick Links
Edit `quick-links-sidebar.tsx` to:
- Add/remove categories
- Change link paths
- Modify category labels

### Trending Videos
Edit `trending-videos.tsx` to:
- Change video limit
- Modify sort criteria
- Adjust display format

### Styling
Edit the `.less` files to:
- Change colors
- Adjust spacing
- Modify responsive breakpoints

## Testing

1. Visit the homepage
2. Verify quick links sidebar appears on the left
3. Verify performer grid appears in the middle
4. Verify trending videos appear on the right
5. Test responsive behavior on different screen sizes
6. Click quick links to verify navigation
7. Click videos to verify video detail page navigation

## Notes

- The trending videos component will show empty state if no videos are available
- Quick links use search page with query parameters for filtering
- Sidebars are sticky on desktop for better UX
- All components are responsive and mobile-friendly

