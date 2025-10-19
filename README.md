# Brand Maestro

## 🚀 [Live Demo](https://brandmaestro.vercel.app/)

Try Brand Maestro now at **[brandmaestro.vercel.app](https://brandmaestro.vercel.app/)**

## Every creator has a brand.

But the moment they scale—different editors, platforms, languages—their identity mutates faster than a T-Rex in a thunderstorm. Brand Maestro is an AI web service that extracts a creator's brand genome and turns it into a living style guide. We analyze videos technically and emotionally—color, typography, pacing, tone, and narrative flow—to create a precise, machine-readable brand DNA map.

Under the hood, we run multi-layered analysis with Gemini, Exa, Groq, and FAL. Technical tracking captures logos, fonts, color palettes, and motion rhythm through computer vision. Content analysis parses transcripts, sentiment, and storytelling structure. Emotional intelligence detects mood arcs and vocal energy. Everything is stored so your brand guideline evolves as new videos arrive. Drop a new video, and Maestro checks it against the DNA—flagging weak branding or tone drifts before they damage your identity.

From that same DNA, we can generate entire videos from a script using AI video generation. Each one matches the influencer's visual grammar and cognitive rhythm, automatically adapting to each platform's unique strengths. It's brand compliance checking meets brand cloning—without the dinosaur rampage. Know thyself: it's not just power, it's cash flow.

## Integrations

- ✅ **Google** - Gemini AI for video analysis and brand compliance checking, Veo 3 for AI video generation
- ✅ **Groq** - Fast AI inference for video content analysis and brand compliance checking
- ✅ **FAL** (Fal.ai) - AI video generation using Veo 3 model
- ✅ **Exa** - Real-time web search for sensitive topics and contextual risk analysis
- ⬜ **ElevenLabs** - Not currently integrated
- ⬜ **Smithery** - Not currently integrated
- ⬜ **Supabase** - Not currently integrated
- ⬜ **Convex** - Not currently integrated
- ⬜ **mem0** - Not currently integrated

## Features

- **Brand DNA Extraction**: Analyze videos to extract brand guidelines, colors, fonts, and messaging ([Try it](https://brandmaestro.vercel.app/))
- **Video Compliance Checking**: Check videos against brand guidelines for technical compliance ([Try it](https://brandmaestro.vercel.app/brandcheck))
- **Enhanced Risk Analysis**: Use Exa search to identify recent sensitive topics and cultural risks ([Try it](https://brandmaestro.vercel.app/brandcheck))
- **AI Video Generation**: Generate videos from scripts using AI ([Try it](https://brandmaestro.vercel.app/vidgen))
- **Content Strategy**: Get AI-powered content strategy advice ([Try it](https://brandmaestro.vercel.app/))

## Environment Setup

Create a `.env.local` file with the following API keys:

```bash
# Exa API Configuration
EXA_API_KEY=your_exa_api_key_here

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Fal API Configuration
FAL_KEY=your_fal_api_key_here

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

