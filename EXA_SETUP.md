# Exa Integration Setup Guide

## Issue: "Failed to perform check with Exa"

This error occurs when the required API keys are not configured. Here's how to fix it:

## Required API Keys

You need to set up the following API keys in your `.env` file:

### 1. Exa API Key
- Sign up at [exa.ai](https://exa.ai)
- Get your API key from the dashboard
- Add to `.env`:
```bash
EXA_API_KEY=your_actual_exa_api_key_here
```

### 2. Groq API Key
- Sign up at [groq.com](https://groq.com)
- Get your API key from the console
- Add to `.env`:
```bash
GROQ_API_KEY=your_actual_groq_api_key_here
```

## Complete .env File Example

Create or update your `.env` file in the project root:

```bash
# Exa API Configuration
EXA_API_KEY=your_actual_exa_api_key_here

# Groq API Configuration
GROQ_API_KEY=your_actual_groq_api_key_here

# Other existing environment variables...
```

## Testing Without API Keys

If you don't have API keys yet, the system will:
- ✅ Still work for basic brand compliance checking (when toggle is off)
- ⚠️ Show limited results for enhanced compliance (when toggle is on)
- 🔄 Fall back to mock data for video analysis and sensitive topics

## After Setting Up API Keys

1. Restart your development server:
```bash
npm run dev
```

2. Try the enhanced compliance check again
3. You should now see real-time sensitive topics analysis

## Troubleshooting

- **"API keys not configured"**: Make sure your `.env` file is in the project root and contains the correct API keys
- **"Failed to perform check with Exa"**: Check that your Exa API key is valid and has sufficient credits
- **"Failed to generate video summary"**: Check that your Groq API key is valid
- **"Model decommissioned"**: The system now uses `llama-3.1-8b-instant` model. If you see model errors, ensure you're using the latest code
- **"JSON parsing error"**: The system now handles cases where AI models return text instead of pure JSON
- **"Enhanced compliance check failed"**: The system will automatically disable enhanced features and fall back to basic compliance checking

## Risk Filtering Criteria

The system only flags **high** and **critical** risk factors with **actual business impact**:

### Critical Risk Keywords:
- lawsuit, boycott, crisis, illegal, fraud, corruption, criminal, bankruptcy, shutdown, banned, prosecution

### High Risk Keywords:
- backlash, criticism, protest, negative, accusation, allegation, investigation, resignation, fired, terminated, recall, withdrawal

### Medium/Low Risk (Considered Compliant):
- concern, issue, problem, debate, discussion, question, challenge, complaint, review

### Business Impact Requirements:
Results must contain business impact indicators such as:
- Financial: revenue, sales, profit, loss, stock, market, shareholder, investor
- Customer: customer, client, user, subscriber, audience, viewer, follower
- Legal: regulatory, compliance, legal, court, settlement, fine, penalty
- Business: partnership, sponsor, advertiser, brand, reputation, pr, public relations
- Operations: employee, staff, workforce, hiring, layoff, termination

**Result:** Only serious risks with clear business impact are flagged - minor concerns and "stir" content are filtered out and show as "compliant."

## Auto-Recovery Features

The system now includes several auto-recovery features:

1. **Auto-disable enhanced features** if API keys are missing or invalid
2. **Fallback to mock data** when video analysis fails
3. **Graceful degradation** to basic compliance checking
4. **Better error messages** with specific guidance
5. **JSON parsing recovery** for AI model responses

## Features Available

### With API Keys:
- ✅ Full video content analysis with Groq
- ✅ Real-time sensitive topics detection with Exa
- ✅ Recent news and cultural context analysis
- ✅ Source links to relevant articles
- ✅ Brand name auto-population from brand analysis
- ✅ **Compliant label** when no high or critical risk sensitive topics are found

### Without API Keys:
- ✅ Basic brand compliance checking
- ⚠️ Mock video analysis
- ⚠️ No sensitive topics detection
- ✅ Brand name auto-population still works

## Brand Name Auto-Population

The system now automatically extracts and stores the brand name during the initial brand analysis step with this priority:

1. **YouTube channel name or handle** (most preferred)
2. **Company/brand name** from logos or watermarks  
3. **Brand name** mentioned in voiceover or text
4. **Social media handle** or website domain
5. **Product/service name** that represents the brand

When you run a compliance check:

1. **Brand name is auto-populated** from your previous brand analysis
2. **Visual indicator** shows "✓ Auto-populated from brand analysis"
3. **Editable field** - you can still modify the brand name if needed
4. **Fallback** - if no brand name was extracted, you can enter it manually
