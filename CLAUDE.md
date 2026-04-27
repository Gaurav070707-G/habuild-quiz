# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Coffee Personality Quiz** — An interactive quiz app that matches users to one of three coffee personalities based on their answers, providing a personalized coffee drink recommendation.

**Tech Stack:**
- Next.js 16.2.3 with App Router
- React 19.2.4
- TypeScript 5
- Tailwind CSS v4
- Vercel deployment

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

**Note:** This is Next.js 16 — check `node_modules/next/dist/docs/` for API differences from training data.

---

## Architecture & Data Model

### Single Component Architecture

All quiz logic lives in **`app/page.tsx`** (~190 lines) with no separate components:

- **State Management:** `useState` for question progress and personality scores
- **Rendering:** Conditional rendering based on quiz completion state
- **Data:** Questions and personality mappings hardcoded in component

### Data Structure

**Personalities** (defined as const object):
```typescript
{
  boldAdventurer: { name, coffee, tagline, emoji },
  sweetEnthusiast: { name, coffee, tagline, emoji },
  healthNut: { name, coffee, tagline, emoji }
}
```

**Questions** (array of 6 objects):
```typescript
{
  question: string,
  answers: [
    { text, emoji, personality: key },
    ...
  ]
}
```

**Scores** (state object):
```typescript
{
  boldAdventurer: number,  // Points accumulated
  sweetEnthusiast: number,
  healthNut: number
}
```

### Quiz Logic Flow

1. User starts on first question (currentQuestion = 0)
2. Each answer increments that personality's score by 1
3. Advance to next question (currentQuestion++)
4. After 6 questions (currentQuestion >= 6), show results
5. Winner determined by highest score using `Math.max()`
6. Reset button clears scores and returns to question 0

---

## Styling System

### Color Palette

**Background Gradient:**
- From: `#667eea` (purple)
- To: `#764ba2` (deeper purple)

**Container Gradient:**
- From: `#f5e6d3` (warm cream)
- To: `#ede0d0` (light beige)

**Text Colors:**
- Primary: `#5a4a3a` (warm brown)
- Secondary: `#8b7355` (earth tone)

**Buttons:**
- Default: White background with earth tone borders
- Hover: Purple gradient background with white text
- Progress bar: Purple gradient fill

### Key Classes

- **Progress bar:** `bg-gradient-to-r from-[#667eea] to-[#764ba2]`
- **Answer buttons:** Full-width, flex layout with emoji + text, smooth hover transitions
- **Result display:** Large emoji (text-6xl), centered text, white info box

### Responsive Design

- Mobile: `max-w-2xl` card with `p-4` padding
- Desktop: Same card with `p-8 md:p-12` padding
- Headings scale with `text-2xl md:text-3xl` and `text-3xl md:text-4xl`

---

## Key Implementation Details

### Answer Handling

```typescript
const handleAnswer = (personality) => {
  increment score for that personality
  advance to next question
}
```

Each button click increments one personality's score and moves forward — no branching logic.

### Result Calculation

```typescript
const getResult = () => {
  find personality with highest score
  if tie: first in iteration order wins (boldAdventurer > sweetEnthusiast > healthNut)
  return personality object with coffee recommendation
}
```

**Note:** Ties use object entry iteration order (not random).

### Conditional Rendering

- **Before completion:** Show progress bar, question, and 3 answer buttons
- **After completion:** Show emoji, personality name, coffee recommendation, "Take Quiz Again" button

---

## File Structure

```
app/
├── page.tsx        # Main quiz component (all logic)
├── layout.tsx      # Root layout with metadata and fonts
└── globals.css     # Global styles (Tailwind)
```

**Static files:**
- `public/` — Currently empty; can add images later
- Fonts loaded from Google via `next/font`

---

## Styling Notes

- **No CSS modules or separate stylesheets** — All styling via Tailwind classes
- **Inline gradients** — Color values use arbitrary Tailwind syntax `[#hexcode]`
- **Transitions** — `transition-all duration-200` for smooth hover effects
- **Layout:** Flexbox for emoji + text answers, grid for sections

### If Updating Colors

1. Change gradient colors in `className` strings (search for `#667eea`, `#764ba2`, etc.)
2. Update text colors (`#5a4a3a`, `#8b7355`)
3. Update button borders (`border-[#8b7355]`)
4. Gradients used in: background, progress bar, button hovers

---

## Important Quirks & Limitations

1. **Hardcoded Data** — All quiz content in component; no database/API
2. **Tie-Breaking** — If two personalities have same score, the one that appears first in the object wins
3. **No Sharing** — Results aren't saved or shareable; each refresh resets
4. **No Images** — Requirements say "Skip images for now"; design is text + emoji only
5. **No Analytics** — No tracking of user choices or results

---

## Common Development Tasks

### Adding a New Question

1. Add object to `questions` array with structure: `{ question: string, answers: [...] }`
2. Each answer must map to one of the 3 personality keys
3. Quiz length updates automatically (based on `questions.length`)

### Changing Personality Definitions

1. Update `personalities` object with new name, coffee, tagline, emoji
2. Update all `answers` objects to use correct personality key
3. Result display automatically uses updated values

### Adding Images Later

1. Create images in `/public/` directory
2. Import Next.js Image component in page.tsx
3. Add `<Image>` elements to result display or answer options
4. Update styling to accommodate image layouts

### Adjusting Colors

- Search for hex color codes in className strings
- Update background gradient, text colors, button borders simultaneously
- Test hover states on buttons

---

## Testing Notes

- Quiz logic is simple: just test that all 6 questions appear, scores increment correctly, and results show
- Test tie scenarios (e.g., select answers that result in equal scores)
- Verify reset button clears state and returns to question 1

---

## Deployment

- Project is configured for Vercel via `.vercel/project.json`
- Build and deploy via standard Next.js flow: `npm run build` → push to git

---

## Resources

- **Requirements:** `REQUIREMENTS.md`
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS v4:** https://tailwindcss.com/docs
