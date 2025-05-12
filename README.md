# Noiz

Frontend interface for **Noiz**, a web application developed for **CPSC 449 - Web Back-End Engineering** at California State University, Fullerton.

## Overview

Noiz enhances your music experience by combining personalization, social discovery, and powerful tools.

- Generate playlists tailored to your vibe and occasion  
- See what your friends are listening to  
- Stay in the zone with Focus Mode  
- Search for any artist directly through Spotify

## Technologies Used

- React.js  
- Node.js

## Getting Started

### Prerequisites

- Node.js (v14 or higher)  
- npm (v6 or higher)

### Installation

1. Clone the repository:  
   `git clone https://github.com/ChristianHuerta05/CPSC449-NOIZ.git`

2. Navigate to the frontend directory:  
   `cd frontend`

3. Install dependencies:  
   `npm install`

4. Run the frontend:  
   `npm run dev`

5. Navigate to the backend directory:  
   `cd ..`  
   `cd backend`

6. Run the server
    `node index.js`

7. Build the Docker image:  
   `docker build -t noiz-backend .`

8. Run the container:  
   `docker run -p 8080:8080 noiz-backend`

## Live Site

OR Visit the app at:  
[https://noiz-263685964541.us-central1.run.app/](https://noiz-263685964541.us-central1.run.app/)