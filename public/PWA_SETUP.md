# Flashcard Maker - PWA Setup Guide

## 🎉 Your app is now a Progressive Web App!

Users can now install your flashcard app on their mobile devices and use it offline, just like a native app.

## 📱 How to Install

### On Mobile Devices:

**Android (Chrome):**
1. Open the app in Chrome
2. Tap the menu (⋮) in the top right
3. Tap "Install app" or "Add to Home screen"
4. Confirm installation

**iOS (Safari):**
1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

**Desktop (Chrome/Edge):**
1. Open the app in the browser
2. Look for the install icon in the address bar
3. Click "Install"

## 🔧 Setup Instructions

### 1. Generate PNG Icons (Optional but Recommended)

While SVG icons work in modern browsers, some devices prefer PNG icons. To generate them:

1. Open `generate-icons.html` in your browser
2. Click "Download 192x192 Icon"
3. Click "Download 512x512 Icon"
4. Save the files as `icon-192.png` and `icon-512.png` in the `public` folder
5. Update `manifest.json` to reference the PNG files:

```json
{
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 2. Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select your branch (main/master) and folder (/root)
4. Your app will be available at: `https://yourusername.github.io/yourrepo/flashcard.html`

### 3. Update URLs

In `flashcard.html`, update these constants at the top of the script:

```javascript
const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/flashcard.html';
const APP_URL = 'https://YOUR_USERNAME.github.io/YOUR_REPO/flashcard.html';
```

## ✨ PWA Features

### Offline Support
- The app caches all resources on first load
- Works completely offline after initial visit
- All data stored in localStorage

### Installable
- Can be installed on home screen
- Runs in standalone mode (no browser UI)
- Custom app icon and splash screen

### Auto-Updates
- Service worker checks for updates
- Users get latest version automatically
- No need to manually refresh

### P2P Sharing
- Share decks via QR code
- Direct browser-to-browser transfer
- No server required for data transfer

## 📋 File Structure

```
public/
├── flashcard.html          # Main app file
├── manifest.json           # PWA configuration
├── sw.js                   # Service worker for offline support
├── icon.svg                # App icon (SVG)
├── icon-192.png           # App icon (192x192) - optional
├── icon-512.png           # App icon (512x512) - optional
└── generate-icons.html    # Tool to generate PNG icons
```

## 🔒 HTTPS Required

PWA features require HTTPS. GitHub Pages provides this automatically. If hosting elsewhere, ensure your site uses HTTPS.

## 🎨 Customization

### Change App Name
Edit `manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "Short Name"
}
```

### Change Theme Color
Edit `manifest.json` and the meta tag in `flashcard.html`:
```json
{
  "theme_color": "#yourcolor"
}
```

### Change App Icon
Replace `icon.svg` with your own design, or generate PNG icons using the included tool.

## 🐛 Troubleshooting

**App won't install:**
- Ensure you're using HTTPS
- Check that manifest.json is accessible
- Verify service worker is registered (check browser console)

**Icons not showing:**
- Generate PNG icons using `generate-icons.html`
- Update manifest.json to reference PNG files
- Clear browser cache and reload

**Offline not working:**
- Check browser console for service worker errors
- Ensure sw.js is accessible
- Verify all resources are cached correctly

## 📊 Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (iOS 11.3+)
- ✅ Samsung Internet
- ✅ Opera

## 🚀 Next Steps

1. Deploy to GitHub Pages
2. Test installation on mobile devices
3. Share the URL with users
4. They can install it like a native app!

---

**Note:** All user data (decks, cards, progress) is stored locally in the browser's localStorage. Data is not synced between devices unless explicitly shared via P2P.
