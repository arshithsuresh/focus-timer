# Zen Timer

Build a scalable, minimalist Pomodoro Timer web application. The architecture should be clean, modular, and easy to expand upon later. 

Design System & UI:

- Aesthetic: Ultra-minimalist, ample whitespace, modern typography (sans-serif), and a monochromatic or muted color palette. 

- Layout: Centered main container. 

Core Features & Components:

1. Main Timer Display: A large, highly legible countdown clock (MM:SS format). Above the clock, display the current phase (e.g., "Focus", "Short Break", "Long Break").

2. Controls: Simple, sleek buttons for "Start", "Pause", and "Reset".

3. Settings Modal: A gear icon in the top right corner that opens a preference popup. This popup should have input fields to adjust the default durations for: Focus Time (default 25m), Short Break (default 5m), and Long Break (default 15m). Include a "Save" button to apply changes and close the modal.

4. Audio Alert: When the countdown reaches zero, play a simple, pleasant notification chime using standard HTML5 audio, then automatically switch to the next logical phase (e.g., Focus -> Short Break), waiting for the user to press "Start" again.

Technical Requirements:

- Use React state for managing the timer logic and user preferences.

- Ensure the component structure is modular (e.g., separate files/components for the TimerDisplay, Controls, and SettingsModal) so it remains scalable for future feature additions.

- Use Tailwind CSS for the minimalist styling.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/da758083-a074-4f24-9db0-56f0019cc3ba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
