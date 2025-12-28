# Help & Support Content Structure

## Overview
This document explains how the Help & Support (Hulp en Ondersteuning) page is structured and how to add new content.

## File Structure

```
user/pages/hulp-en-ondersteuning/
├── index.tsx          # Main page component
├── index.less         # Styles
└── HELP_CONTENT_STRUCTURE.md  # This file
```

## Content Location

All help content is defined in `index.tsx` within the `HELP_SECTIONS` constant (lines 12-95).

## Content Structure

The content is organized into sections, each containing multiple Q&A pairs:

```typescript
{
  key: 'section-key',        // Unique identifier
  title: 'Section Title',     // Displayed in accordion header
  content: [
    {
      question: 'Question text?',
      answer: 'Answer text...'
    }
  ]
}
```

## Current Sections

1. **Account Problemen** (`account`)
   - Account creation
   - Login issues
   - Account blocking
   - Email changes

2. **Gebruikersnaam Herstel** (`username`)
   - Username recovery
   - Username changes
   - Username availability

3. **Betalingen** (`payments`)
   - Payment methods
   - Payment failures
   - Payment processing
   - Refunds
   - Payment security

4. **Profielbeheer** (`profile`)
   - Profile editing
   - Photo uploads
   - Password changes
   - Privacy settings
   - Account deletion

## Adding New Help Topics

### Method 1: Add to Existing Section

1. Open `user/pages/hulp-en-ondersteuning/index.tsx`
2. Find the relevant section in `HELP_SECTIONS`
3. Add a new Q&A object to the `content` array:

```typescript
{
  question: 'Your new question?',
  answer: 'Your answer here...'
}
```

### Method 2: Create New Section

1. Open `user/pages/hulp-en-ondersteuning/index.tsx`
2. Add a new section object to `HELP_SECTIONS`:

```typescript
{
  key: 'new-section-key',
  title: 'New Section Title',
  content: [
    {
      question: 'First question?',
      answer: 'First answer...'
    },
    {
      question: 'Second question?',
      answer: 'Second answer...'
    }
  ]
}
```

3. The new section will automatically appear in the accordion

## Content Guidelines

### Language
- **All content must be in Dutch**
- Use clear, simple language
- Avoid technical jargon when possible
- Write in a friendly, helpful tone

### Format
- Questions should be clear and specific
- Answers should be concise but complete
- Use proper Dutch grammar and spelling
- Keep paragraphs short for readability

### Structure
- One question per item
- One answer per question
- Answers can be multiple sentences
- Use line breaks for readability if needed

## Styling

Styles are defined in `index.less`:
- Accordion layout for sections
- Q&A pairs with clear separation
- Responsive design for mobile
- Consistent spacing and typography

## Accessibility

- Page is accessible from footer link only
- No authentication required (`authenticate: false`)
- SEO meta tags included
- Semantic HTML structure
- Keyboard navigation supported (via Ant Design Collapse)

## Future Enhancements

The structure supports future additions:
- **Search functionality**: Can add search through Q&A
- **Categories**: Can group sections into categories
- **Related articles**: Can add cross-references
- **Contact integration**: Already links to contact form
- **Translation**: Structure ready for i18n (currently Dutch only)
- **Images**: Can add images later if needed (currently text-only)

## Example: Adding a New Section

```typescript
// In HELP_SECTIONS array
{
  key: 'technical',
  title: 'Technische Ondersteuning',
  content: [
    {
      question: 'De website laadt niet goed',
      answer: 'Probeer eerst je browser te vernieuwen (F5 of Ctrl+R). Als het probleem aanhoudt, wis je browsercache of probeer een andere browser. Neem contact op als het probleem blijft bestaan.'
    },
    {
      question: 'Ik zie geen foto\'s',
      answer: 'Controleer of JavaScript is ingeschakeld in je browser. Zorg ook dat je browser up-to-date is. Probeer een andere browser als het probleem aanhoudt.'
    }
  ]
}
```

## Notes

- Content is currently hardcoded in the component
- For large-scale content management, consider moving to a database or CMS
- All content is client-side rendered
- No API calls needed for help content
- Page follows existing page templating system

