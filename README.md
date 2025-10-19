# Brand Maestro

A comprehensive brand compliance and video generation platform built with Next.js, Firebase, and AI.

## Features

- **Brand DNA Extraction**: Analyze videos to extract brand guidelines, colors, fonts, and messaging
- **Video Compliance Checking**: Check videos against brand guidelines for technical compliance
- **Enhanced Risk Analysis**: Use Exa search to identify recent sensitive topics and cultural risks
- **AI Video Generation**: Generate videos from scripts using AI
- **Content Strategy**: Get AI-powered content strategy advice

## Environment Setup

Create a `.env.local` file with the following API keys:

```bash
# Exa API Configuration
EXA_API_KEY=your_exa_api_key_here

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Firebase Configuration (if using Firebase)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables in `.env.local`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:9002](http://localhost:9002) in your browser

## Enhanced Compliance Features

The brand compliance checker now includes:

- **Technical Compliance**: Checks for brand guideline violations (colors, fonts, logos, etc.)
- **Contextual Risk Analysis**: Uses Exa search to identify recent sensitive topics that may impact your brand
- **Video Content Analysis**: Uses Groq to analyze video content and extract key themes
- **Real-time Risk Assessment**: Searches for recent news and cultural context related to your content

To use enhanced compliance:
1. Upload a video or provide a YouTube URL
2. Enable "Check for sensitive topics and trending risks"
3. Brand name will be auto-populated from your previous brand analysis (or enter manually)
4. Click "Enhanced Compliance Check"

The system will analyze your video content and search for recent sensitive topics that may be relevant to your brand and content.

## Brand Name Auto-Population

When you run a brand analysis on the main page, the system now extracts and stores the brand name with the following priority:

1. **YouTube channel name or handle** (most preferred)
2. **Company/brand name** from logos or watermarks
3. **Brand name** mentioned in voiceover or text
4. **Social media handle** or website domain
5. **Product/service name** that represents the brand

This brand name is automatically populated in the compliance checker, making it easier to run contextual risk analysis without manual input.
