// Getty Images Metadata Tool - Main Application
class MetadataApp {
    constructor() {
        this.apiKey = null;
        this.images = [];
        this.init();
    }

    init() {
        // Load API key and saved images from localStorage
        this.loadApiKey();
        this.loadSavedImages();

        // Initialize event listeners
        this.initEventListeners();

        // Check API key status
        this.checkApiKeyStatus();

        // Update UI
        this.updateUI();
    }

    initEventListeners() {
        // Settings modal
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettingsModal();
        });

        document.getElementById('closeSettingsBtn').addEventListener('click', () => {
            this.hideSettingsModal();
        });

        document.getElementById('saveApiKeyBtn').addEventListener('click', () => {
            this.saveApiKey();
        });

        // Upload
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileSelect(e.dataTransfer.files);
        });

        // Export modal
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.showExportModal();
        });

        document.getElementById('closeExportBtn').addEventListener('click', () => {
            this.hideExportModal();
        });

        document.getElementById('exportCsvBtn').addEventListener('click', () => {
            this.exportAsCSV();
        });

        document.getElementById('exportJsonBtn').addEventListener('click', () => {
            this.exportAsJSON();
        });

        // Generate all metadata
        document.getElementById('generateAllBtn').addEventListener('click', () => {
            this.generateAllMetadata();
        });
    }

    // API Key Management
    loadApiKey() {
        this.apiKey = localStorage.getItem('gemini_api_key');
    }

    saveApiKey() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const apiKey = apiKeyInput.value.trim();

        if (!apiKey) {
            this.showStatus('apiKeyStatus', 'Please enter an API key', 'error');
            return;
        }

        localStorage.setItem('gemini_api_key', apiKey);
        this.apiKey = apiKey;

        this.showStatus('apiKeyStatus', 'API key saved successfully!', 'success');
        this.checkApiKeyStatus();

        setTimeout(() => {
            this.hideSettingsModal();
        }, 1500);
    }

    checkApiKeyStatus() {
        const warningBanner = document.getElementById('apiKeyWarning');
        if (!this.apiKey) {
            warningBanner.classList.remove('hidden');
        } else {
            warningBanner.classList.add('hidden');
        }
    }

    // Image Management
    async handleFileSelect(files) {
        const fileArray = Array.from(files);

        for (const file of fileArray) {
            if (!file.type.startsWith('image/')) {
                continue;
            }

            // Create image object
            const imageId = this.generateId();
            const imageData = await this.fileToBase64(file);

            const imageObj = {
                id: imageId,
                filename: file.name,
                dataUrl: imageData,
                metadata: {
                    title: '',
                    description: '',
                    keywords: ''
                },
                status: 'pending' // pending, generating, complete, error
            };

            this.images.push(imageObj);
        }

        this.saveImages();
        this.updateUI();
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    deleteImage(imageId) {
        this.images = this.images.filter(img => img.id !== imageId);
        this.saveImages();
        this.updateUI();
    }

    // Metadata Generation with Google Gemini
    async generateMetadata(imageId) {
        if (!this.apiKey) {
            alert('Please set your Google Gemini API key in settings first.');
            this.showSettingsModal();
            return;
        }

        const image = this.images.find(img => img.id === imageId);
        if (!image) return;

        // Update status
        image.status = 'generating';
        this.updateImageCard(image);

        try {
            // Prepare the image for Gemini API (remove data URL prefix)
            const base64Image = image.dataUrl.split(',')[1];
            const mimeType = image.dataUrl.split(';')[0].split(':')[1];

            // Call Gemini API
            const metadata = await this.callGeminiAPI(base64Image, mimeType, image.filename);

            // Update image metadata
            image.metadata = metadata;
            image.status = 'complete';

            this.saveImages();
            this.updateImageCard(image);
        } catch (error) {
            console.error('Error generating metadata:', error);
            image.status = 'error';
            this.updateImageCard(image);
            alert(`Error generating metadata: ${error.message}`);
        }
    }

    async callGeminiAPI(base64Image, mimeType, filename) {
        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

        const prompt = `Act as an expert stock photography editor for a major global agency.
You receive batches of photographs at a time. Your job is to write a professional, editorial‑style caption and a strong keyword set optimised for search and licensing for each image.

Follow this structure exactly:

1. Caption format
- Line 1: exact filename only, for example 'DSC_0001.jpg'.
- Line 2: short, factual title in Title Case that states the main subject and, where known, the place (for example 'Historic Brick Townhouses With Shutters In Toulouse' or 'Woman Using Smartphone On Commuter Train').
- Line 3: few paragraphs caption, present tense, starting with location and date in this format: 'City, Country – Month Day, Year. …'. Then give a precise, objective description that answers:
  -  WHAT: main subject(s), actions, objects, visible text, materials, colours, environment.
  -  WHERE: city, region, country, and specific place if it is known (street, square, building, interior, landscape, etc.).
  -  WHEN: shooting date (already in the lead) and any relevant time of day or season if clear.
  -  WHO: people or named places/brands only when clearly identifiable and relevant; add roles or professions if known (tourists, commuters, baker, student, etc.).
  -  CONTEXT: only verifiable factual context: historical, architectural, cultural, economic or environmental facts that help a buyer understand the image. No speculation, no opinions, no marketing language.
- Do NOT add a closing commentary sentence like 'The image illustrates…' or 'This symbolizes…'. Stay strictly descriptive.
- Include relevant historical, architectural, cultural details and trivia. For example for place names, include origin history.

2. Style rules
- Neutral, precise language; avoid value adjectives like 'beautiful', 'stunning', 'picturesque', 'authentic', 'iconic'.
- No guessing: if information is uncertain, leave it out or use safe wording such as 'unidentified woman', 'a type of pastry', 'appears to be an office building'.
- Do not invent brands, names or exact locations you cannot see.
- Use present tense, third person, and plain prose (no hashtags, no bullet points).
- Two paragraphs

3. Keywords
- After the caption, add one line starting with 'Keywords:'.
- Provide a comma‑separated list with:
  -  Main subject and variants (e.g. 'Street Sign, Road Sign, Architecture, Apartment Building, Office, Food, Dessert, Landscape').
  -  Visual details and materials (e.g. 'Brick, Stone, Glass, Wrought Iron, Neon Sign, Pastry, Laptop, Trees, Night, Daylight').
  -  People and concepts (e.g. 'Woman, Man, Group Of People, Commuting, Travel, Tourism, Business, Technology, Education, Healthcare' where relevant).
  -  Location hierarchy if known (neighbourhood, city, region/state, country, continent).
  -  Usage concepts (e.g. 'Backgrounds, Copy Space, Lifestyle, Urban, Rural, No People, Editorial, Horizontal, Vertical').
- No full stop at the end of the keyword line. Avoid duplicates and obvious spam. Use Getty Images compliant keywords. Singular preferred to plural.

4. Output
- Return exactly:
  Line 1: filename
  Line 2: title
  Line 3: caption paragraph
  Line 4: 'Keywords: …'
- Do not add explanations, notes, or any extra text before or after these four lines.

Notes:
- For street name signs, architectural details, style, font of sign and what it says about when it was made, also include name origin history. Highlight quirks, errors, inconsistent spacing or alignment etc
- For buildings, identify and name landmarks or main visible buildings, including architectural style, interesting facts, era and architect
- For food and ingredients include current and historical uses, name origins

The filename is: ${filename}`;

        const requestBody = {
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Image
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.4,
                topK: 32,
                topP: 1,
                maxOutputTokens: 4096,
            }
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API request failed');
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        // Parse the response
        return this.parseGeminiResponse(text);
    }

    parseGeminiResponse(text) {
        const metadata = {
            title: '',
            description: '',
            keywords: ''
        };

        // Split response into lines
        const lines = text.split('\n');

        // Find the Keywords line
        const keywordsIndex = lines.findIndex(line => line.toLowerCase().startsWith('keywords:'));

        if (keywordsIndex !== -1) {
            // Line 1: filename (skip it)
            // Line 2: title
            if (lines.length > 1) {
                metadata.title = lines[1].trim();
            }

            // Lines 3 to keywords line: caption
            if (keywordsIndex > 2) {
                const captionLines = lines.slice(2, keywordsIndex);
                metadata.description = captionLines.join('\n').trim();
            }

            // Keywords line
            const keywordsLine = lines[keywordsIndex];
            metadata.keywords = keywordsLine.replace(/^keywords:\s*/i, '').trim();
        } else {
            // Fallback parsing if format doesn't match
            // Try to extract anything after first line as title
            if (lines.length > 1) {
                metadata.title = lines[1].trim();
            }
            // Everything else as description
            if (lines.length > 2) {
                metadata.description = lines.slice(2).join('\n').trim();
            }
        }

        return metadata;
    }

    async generateAllMetadata() {
        const pendingImages = this.images.filter(img =>
            img.status === 'pending' || img.status === 'error'
        );

        if (pendingImages.length === 0) {
            alert('All images already have metadata generated.');
            return;
        }

        if (!this.apiKey) {
            alert('Please set your Google Gemini API key in settings first.');
            this.showSettingsModal();
            return;
        }

        this.showLoading(`Generating metadata for ${pendingImages.length} images...`);

        for (let i = 0; i < pendingImages.length; i++) {
            this.updateLoadingText(`Generating metadata ${i + 1}/${pendingImages.length}...`);
            await this.generateMetadata(pendingImages[i].id);
            // Small delay to avoid rate limiting
            await this.sleep(1000);
        }

        this.hideLoading();
        alert('Metadata generation complete!');
    }

    // Metadata Editing
    updateMetadata(imageId, field, value) {
        const image = this.images.find(img => img.id === imageId);
        if (image) {
            image.metadata[field] = value;
            this.saveImages();
        }
    }

    // Local Storage
    saveImages() {
        try {
            // Save image metadata (not full base64 data due to size limits)
            const imagesToSave = this.images.map(img => ({
                id: img.id,
                filename: img.filename,
                dataUrl: img.dataUrl, // Note: localStorage has 5-10MB limit
                metadata: img.metadata,
                status: img.status
            }));

            localStorage.setItem('saved_images', JSON.stringify(imagesToSave));
        } catch (e) {
            console.warn('Failed to save to localStorage (quota exceeded):', e);
            // If localStorage is full, keep only metadata
            const metadataOnly = this.images.map(img => ({
                id: img.id,
                filename: img.filename,
                metadata: img.metadata,
                status: img.status
            }));
            localStorage.setItem('saved_images', JSON.stringify(metadataOnly));
        }
    }

    loadSavedImages() {
        try {
            const saved = localStorage.getItem('saved_images');
            if (saved) {
                this.images = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load saved images:', e);
        }
    }

    // Export Functionality
    exportAsCSV() {
        if (this.images.length === 0) {
            alert('No images to export');
            return;
        }

        // Create CSV header
        let csv = 'Filename,Title,Caption,Keywords\n';

        // Add rows
        this.images.forEach(img => {
            const row = [
                this.escapeCSV(img.filename),
                this.escapeCSV(img.metadata.title),
                this.escapeCSV(img.metadata.description),
                this.escapeCSV(img.metadata.keywords)
            ];
            csv += row.join(',') + '\n';
        });

        // Download
        this.downloadFile(csv, 'getty-metadata.csv', 'text/csv');
        this.hideExportModal();
    }

    exportAsJSON() {
        if (this.images.length === 0) {
            alert('No images to export');
            return;
        }

        const exportData = this.images.map(img => ({
            filename: img.filename,
            title: img.metadata.title,
            description: img.metadata.description,
            keywords: img.metadata.keywords
        }));

        const json = JSON.stringify(exportData, null, 2);
        this.downloadFile(json, 'getty-metadata.json', 'application/json');
        this.hideExportModal();
    }

    escapeCSV(str) {
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // UI Updates
    updateUI() {
        this.updateImageCount();
        this.updateImagesGrid();
        this.updateButtons();
    }

    updateImageCount() {
        document.getElementById('imageCount').textContent = this.images.length;
    }

    updateButtons() {
        const hasImages = this.images.length > 0;
        document.getElementById('generateAllBtn').disabled = !hasImages;
        document.getElementById('exportBtn').disabled = !hasImages;
    }

    updateImagesGrid() {
        const grid = document.getElementById('imagesGrid');

        if (this.images.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">No images uploaded yet</p>';
            return;
        }

        grid.innerHTML = '';

        this.images.forEach(image => {
            const card = this.createImageCard(image);
            grid.appendChild(card);
        });
    }

    createImageCard(image) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.dataset.imageId = image.id;

        card.innerHTML = `
            <div class="image-preview">
                <img src="${image.dataUrl}" alt="${image.filename}">
                <div class="image-actions">
                    <button class="delete-btn" data-id="${image.id}" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="image-metadata">
                <span class="metadata-status ${image.status}">${this.getStatusText(image.status)}</span>

                <div class="form-group">
                    <label>Title:</label>
                    <input type="text"
                           class="title-input"
                           data-id="${image.id}"
                           value="${image.metadata.title}"
                           placeholder="Click Generate to create metadata">
                </div>

                <div class="form-group">
                    <label>Caption:</label>
                    <textarea class="description-input"
                              data-id="${image.id}"
                              placeholder="Click Generate to create metadata">${image.metadata.description}</textarea>
                </div>

                <div class="form-group">
                    <label>Keywords:</label>
                    <textarea class="keywords-input"
                              data-id="${image.id}"
                              placeholder="Click Generate to create metadata">${image.metadata.keywords}</textarea>
                </div>

                <button class="btn btn-success btn-small generate-btn" data-id="${image.id}">
                    ${image.status === 'complete' ? 'Regenerate' : 'Generate'} Metadata
                </button>
            </div>
        `;

        // Event listeners
        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            if (confirm('Delete this image?')) {
                this.deleteImage(e.target.dataset.id);
            }
        });

        card.querySelector('.generate-btn').addEventListener('click', (e) => {
            this.generateMetadata(e.target.dataset.id);
        });

        card.querySelector('.title-input').addEventListener('input', (e) => {
            this.updateMetadata(e.target.dataset.id, 'title', e.target.value);
        });

        card.querySelector('.description-input').addEventListener('input', (e) => {
            this.updateMetadata(e.target.dataset.id, 'description', e.target.value);
        });

        card.querySelector('.keywords-input').addEventListener('input', (e) => {
            this.updateMetadata(e.target.dataset.id, 'keywords', e.target.value);
        });

        return card;
    }

    updateImageCard(image) {
        const card = document.querySelector(`[data-image-id="${image.id}"]`);
        if (card) {
            const newCard = this.createImageCard(image);
            card.replaceWith(newCard);
        }
    }

    getStatusText(status) {
        const statusMap = {
            'pending': '⏳ Pending',
            'generating': '⚙️ Generating...',
            'complete': '✅ Complete',
            'error': '❌ Error'
        };
        return statusMap[status] || status;
    }

    // Modal Management
    showSettingsModal() {
        document.getElementById('settingsModal').classList.remove('hidden');
        if (this.apiKey) {
            document.getElementById('apiKeyInput').value = this.apiKey;
        }
    }

    hideSettingsModal() {
        document.getElementById('settingsModal').classList.add('hidden');
        document.getElementById('apiKeyStatus').innerHTML = '';
    }

    showExportModal() {
        document.getElementById('exportModal').classList.remove('hidden');
    }

    hideExportModal() {
        document.getElementById('exportModal').classList.add('hidden');
    }

    showLoading(text = 'Processing...') {
        document.getElementById('loadingText').textContent = text;
        document.getElementById('loadingOverlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }

    updateLoadingText(text) {
        document.getElementById('loadingText').textContent = text;
    }

    showStatus(elementId, message, type) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.className = `status-message ${type}`;
    }

    // Utility
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MetadataApp();
});
