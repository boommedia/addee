# Addee: AI Ad Creatives & Social Content Generator

Addee is Boom Media's tool for generating AI ad creatives and social media posts in your brand's voice. Generate nearly ready-to-publish, fully editable ads and social content for Instagram, LinkedIn, TikTok, Google Ads, and more.

## Current Status
- Phase 1: Core setup and adaptation from bloggy
- Production: addee.online (TBD)
- Stack: Next.js 16, Supabase, Claude Sonnet 4.6 + OpenAI, Vercel
- Contact: eric@boommedia.us

## Architecture
Based on bloggy's proven patterns. Core flow: Brand Setup → Campaign Brief → AI Generation → Edit/Refine → Publish.

Removing: Blog-specific features (SEO scoring, keyword research)
Adapting: Generation endpoints, approval workflows, credit system, social integrations
Adding: Multi-format ad templates, brand voice training, platform-specific publishing
