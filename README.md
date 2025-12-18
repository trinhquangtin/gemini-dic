# Gemini Dictionary Chrome Extension

A Chrome extension that explains Japanese words using Google's Gemini AI.

## Features

- 🔍 Instant Japanese word explanations
- 🤖 Powered by Google Gemini AI
- ⚡ Rate limiting to prevent API quota issues
- 🎯 Simple and clean interface
- 📱 Lightweight browser extension

## Installation

1. **Get Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Generate a new API key
   - Copy the key for setup

2. **Setup Extension**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gemini-dic.git
   cd gemini-dic
   ```
   NOTE: git remote set-url origin https://trinhquangtin:<personal-access-token>@github.com/trinhquangtin/gemini-dic.git

3. **Configure API Key**
   - Open `popup.js`
   - Replace `YOUR_API_KEY` with your actual Gemini API key:
   ```javascript
   const GEMINI_API_KEY = 'your_actual_api_key_here';
   ```

4. **Load in Chrome**
   - Open Chrome → Extensions → Developer mode ON
   - Click "Load unpacked" → Select project folder
   - Extension icon appears in toolbar

## Usage

1. Click the extension icon in Chrome toolbar
2. Type a Japanese word in the input field
3. Click "解説する" or press Enter
4. Get AI-powered explanation instantly

**Pro Tips:**
- Double-click the button to check API connection status
- Extension automatically prevents rapid requests (2-second cooldown)

## API Limits

**Free Tier:**
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per minute

If you hit limits, wait for quota reset or upgrade your plan.

## Project Structure

```
gemini-dic/
├── manifest.json      # Extension configuration
├── popup.html         # Extension UI
├── popup.js          # Main functionality
├── images/           # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Technologies

- **Frontend:** HTML, CSS, JavaScript
- **API:** Google Gemini AI
- **Platform:** Chrome Extension Manifest V3

## Troubleshooting

**"Limit exceed" error:**
- Check quota at [Google AI Studio](https://aistudio.google.com/)
- Wait for quota reset (hourly/daily)
- Consider upgrading API plan

**API connection issues:**
- Verify API key is correct
- Check network connection
- Double-click button for connection test

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## License

MIT License - feel free to use and modify.

## Support

For issues or questions, please open an issue on GitHub.