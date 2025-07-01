<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Faculty Review System - Copilot Instructions

This is a Faculty Review System frontend built with React, Astro, and Tailwind CSS. This is a UI-only project with no backend integration.

## Project Structure

- **React Components**: Located in `src/components/` for interactive UI elements
- **Astro Pages**: Located in `src/pages/` for routing and page layouts
- **Mock Data**: Located in `src/data/mockData.ts` for simulating backend data
- **Context**: Located in `src/contexts/` for state management
- **Layouts**: Located in `src/layouts/` for shared page layouts

## Key Features

- Student dashboard for browsing faculty and writing reviews
- Faculty dashboard for viewing reviews and managing profiles
- Admin panel for managing reviews and users
- Review Credits system (earn by writing, spend to view)
- Role switching for demo purposes
- Responsive design with Tailwind CSS

## Technical Notes

- Use `client:load` directive for React components in Astro pages
- All data is mocked - no real API calls or authentication
- TypeScript is used throughout for type safety
- Components should be functional components using React hooks
- Use the `useApp()` hook to access global state

## UI Guidelines

- Follow university-friendly design with blue/gray color scheme
- Use react-icons for icons
- Maintain accessibility with proper ARIA labels and semantic HTML
- Ensure responsive design for mobile, tablet, and desktop

## State Management

- Global state is managed through React Context (`AppContext`)
- Mock data includes users, faculty, reviews, and AI insights
- Review Credits are tracked per user and updated on actions
