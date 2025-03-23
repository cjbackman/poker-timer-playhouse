
# Poker Tournament Timer

A professional poker tournament timer and management application.

## Project info

**URL**: https://lovable.dev/projects/2932a2c0-90f3-4136-b917-1b3637efa38d

## Repository Navigation

This application is built with Vite, React, TypeScript, and Tailwind CSS. Here's a guide to the most important directories and files:

### Core Components

- `src/App.tsx` - Main application component
- `src/components/Layout.tsx` - Page layout and structure
- `src/components/Timer.tsx` - Tournament timer logic and display
- `src/components/BlindDisplay.tsx` - Displays current and next blind levels
- `src/components/PrizePool.tsx` - Shows prize distribution
- `src/components/BuyInsPanel.tsx` - Manages tournament buy-ins
- `src/components/OrganizerPanel.tsx` - Settings panel for tournament organizers

### State Management

- `src/hooks/useTournament.tsx` - Main tournament state and functions
- `src/hooks/useTimer.tsx` - Timer logic and controls

### Utilities

- `src/lib/blindStructures.ts` - Predefined blind structures
- `src/lib/audio.ts` - Audio effects for timer events

## Using the Application

The timer supports keyboard shortcuts:
- **Spacebar**: Play/pause the timer

Tournament organizers can manage:
- Buy-in amounts and rebuys
- Blind structures (predefined or custom)
- Prize pool distribution

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2932a2c0-90f3-4136-b917-1b3637efa38d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.
