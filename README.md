# Getty Images Metadata Tool

A mobile-friendly web app that helps prepare images for Getty Images submission using Google Gemini's FREE API.

## Features

- 📱 **Mobile-Optimized** - Works perfectly on iOS and Android browsers
- 🤖 **AI-Powered** - Uses Google Gemini's free API to generate professional metadata
- 📷 **Image Upload** - Upload single or multiple images
- ✏️ **Edit Metadata** - Review and edit generated titles, descriptions, and keywords
- 💾 **Auto-Save** - Progress saved locally in your browser
- 📊 **Export** - Export metadata as CSV or JSON for Getty Images
- 🔒 **Secure** - API key stored locally in your browser only

## How to Use

### 1. Get Your Free Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

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

The AI will analyze each image and create:
- **Title** - Concise, descriptive title (50-70 characters)
- **Description** - Detailed description (100-200 words)
- **Keywords** - 20-30 relevant keywords for stock photography

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
- `app.js` - Application logic and Gemini API integration

## Technical Details

### Google Gemini API

This app uses the **Gemini 1.5 Flash** model, which is:
- ✅ **FREE** - Free tier includes 15 requests per minute
- ✅ **Fast** - Quick response times
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
- 🔒 Images are sent directly to Google Gemini API
- 🔒 No data is stored on any third-party servers
- 🔒 All processing happens client-side

## Tips for Best Results

1. **Image Quality** - Use high-resolution, well-composed images
2. **Review Metadata** - Always review and refine AI-generated content
3. **Keywords** - Add specific, relevant keywords for better discoverability
4. **Batch Processing** - Upload multiple images and use "Generate All"
5. **Save Regularly** - Images auto-save, but export when done

## Getty Images Submission Guidelines

When preparing metadata for Getty Images:

- **Title**: Clear, concise, factual description
- **Description**: Comprehensive details about content, setting, and mood
- **Keywords**: Relevant, specific terms (avoid keyword stuffing)
- Follow Getty's editorial and commercial guidelines
- Ensure you have proper model/property releases

## Troubleshooting

**API Key Not Working?**
- Verify your API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check that you haven't exceeded the free tier limits (15 requests/minute)

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
- Google Gemini API
- Vanilla JavaScript
- Mobile-first CSS
