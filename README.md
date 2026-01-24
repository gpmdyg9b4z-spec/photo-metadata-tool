# Getty Images Metadata Tool

A mobile-friendly web app that helps prepare images for Getty Images submission using OpenAI's API.

## Features

- 📱 **Mobile-Optimized** - Works perfectly on iOS and Android browsers
- 🤖 **AI-Powered** - Uses OpenAI's GPT-4o-mini to generate professional metadata
- 📷 **Image Upload** - Upload single or multiple images
- ✏️ **Edit Metadata** - Review and edit generated titles, descriptions, and keywords
- 💾 **Auto-Save** - Progress saved locally in your browser
- 📊 **Export** - Export metadata as CSV or JSON for Getty Images
- 🔒 **Secure** - API key stored locally in your browser only

## How to Use

### 1. Get Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy your API key
5. Add credit to your account (costs ~$0.001 per image with GPT-4o-mini)

### 2. Set Up the App

1. Open `index.html` in your mobile or desktop browser
2. Click the settings icon (⚙️) in the top right
3. Paste your API key and click "Save API Key"

### 3. Upload Images

1. Tap the upload area or drag and drop images
2. Images will appear in a grid below

### 4. Generate Metadata

**For individual images:**
- Click "Generate Metadata" button on any image card

**For all images at once:**
- Click "Generate All Metadata" button at the top

The AI will analyze each image and create professional Getty Images-style metadata:
- **Title** - Short, factual title in Title Case (e.g., "Historic Brick Townhouses With Shutters In Toulouse")
- **Caption** - Professional editorial caption with:
  - Location and date in format: "City, Country – Month Day, Year"
  - Detailed description of WHAT, WHERE, WHEN, WHO, and CONTEXT
  - Historical, architectural, and cultural details
  - Neutral, factual language following Getty editorial standards
- **Keywords** - Getty-compliant comma-separated keywords including:
  - Main subjects and visual details
  - Materials, colors, and composition
  - Location hierarchy (neighborhood, city, region, country)
  - Usage concepts (Lifestyle, Urban, Editorial, etc.)

### 5. Edit Metadata

- Click into any text field to edit the generated metadata
- Changes are saved automatically to your browser

### 6. Export

1. Click the "Export" button at the top
2. Choose format:
   - **CSV** - For spreadsheet applications
   - **JSON** - For other tools and systems

## Files

- `index.html` - Main application page
- `styles.css` - Mobile-optimized styling
- `app.js` - Application logic and OpenAI API integration

## Technical Details

### OpenAI API

This app uses the **GPT-4o-mini** model, which is:
- 💰 **Very Affordable** - ~$0.001 per image (less than 1 cent)
- ✅ **Fast** - Quick response times
- ✅ **Reliable** - Works globally, excellent uptime
- ✅ **Multimodal** - Can analyze images and generate text

### Browser Compatibility

- ✅ Chrome/Safari on iOS
- ✅ Chrome/Firefox on Android
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)

### Data Storage

- All data stored in browser localStorage
- Images stored as base64 (note: browser limits apply, typically 5-10MB)
- API key never leaves your browser
- No server required - runs entirely client-side

### Privacy

- 🔒 Your API key is stored only in your browser
- 🔒 Images are sent directly to OpenAI API for processing
- 🔒 No data is stored on any third-party servers besides OpenAI
- 🔒 All processing happens client-side

## Tips for Best Results

1. **Image Quality** - Use high-resolution, well-composed images
2. **Review Metadata** - Always review and refine AI-generated content
3. **Keywords** - Add specific, relevant keywords for better discoverability
4. **Batch Processing** - Upload multiple images and use "Generate All"
5. **Save Regularly** - Images auto-save, but export when done

## Getty Images Editorial Format

This tool uses professional Getty Images editorial standards:

### Caption Structure
- **Location & Date**: Starts with "City, Country – Month Day, Year"
- **WHAT**: Main subjects, actions, objects, visible text, materials, colors
- **WHERE**: Specific places (streets, squares, buildings, landmarks)
- **WHEN**: Date and time of day/season if clear
- **WHO**: People, roles, or professions when identifiable
- **CONTEXT**: Historical, architectural, cultural, or economic facts

### Style Rules
- Neutral, precise language (avoids "beautiful", "stunning", "iconic")
- Present tense, third person
- No speculation—only verifiable facts
- Includes architectural styles, name origins, historical trivia
- For buildings: identifies landmarks, architects, eras
- For food: includes historical uses and name origins
- For signs: notes font, style, quirks, spacing errors

### Keywords
- Getty-compliant, singular preferred over plural
- Organized by subject, visual details, location, and usage
- No duplicates or spam
- Includes materials, composition, and commercial concepts

### Submission Guidelines
- Always review and refine AI-generated content
- Follow Getty's editorial and commercial guidelines
- Ensure you have proper model/property releases
- Verify factual accuracy of historical and architectural details

## Troubleshooting

**API Key Not Working?**
- Verify your API key at [OpenAI Platform](https://platform.openai.com/api-keys)
- Ensure you have added credits to your OpenAI account
- Check that you haven't exceeded rate limits

**Images Not Uploading?**
- Check file format (JPG, PNG, WebP supported)
- Ensure images aren't too large (browser limits apply)
- Try refreshing the page

**Metadata Not Generating?**
- Check your internet connection
- Verify API key is set correctly
- Check browser console for errors (F12)

**localStorage Full?**
- Export your metadata
- Clear old images from the app
- Browser localStorage typically has 5-10MB limit

## License

MIT License - Feel free to modify and use for your own purposes.

## Credits

Built with:
- OpenAI GPT-4o-mini API
- Vanilla JavaScript
- Mobile-first CSS
