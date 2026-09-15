# Flashcard Maker - Android Setup Guide

## What is Termux?
Termux is a terminal app for Android that lets you run a local web server on your phone. This allows the flashcard app to access your camera for QR scanning. **No root required!**

---

## Quick Start (Easiest Method)

### Step 1: Install Termux
Download Termux from one of these sources:
- **F-Droid** (recommended): https://f-droid.org/packages/com.termux/
- **GitHub**: https://github.com/termux/termux-app/releases

⚠️ **Don't use the Play Store version** - it's outdated and won't work properly.

### Step 2: Open Termux and Run This Command
Copy this entire command and paste it into Termux:

```bash
pkg update -y && pkg install python wget unzip -y && mkdir -p ~/flashcard && cd ~/flashcard && wget https://github.com/jjmm3282006-commits/Flash-C/archive/refs/heads/cross-device-web-app-development-7ebac.zip && unzip cross-device-web-app-development-7ebac.zip && mv Flash-C-cross-device-web-app-development-7ebac/* . && rm -rf Flash-C-cross-device-web-app-development-7ebac cross-device-web-app-development-7ebac.zip && chmod +x server.py && python server.py
```

**What this does:**
- Updates Termux packages
- Installs Python and download tools
- Downloads the flashcard app
- Extracts the files
- Starts the web server

You should see:
```
Starting server on http://localhost:8000
Open your browser to: http://localhost:8000/flashcard.html
Press Ctrl+C to stop the server
```

### Step 3: Open Your Browser
Open Chrome (or any browser) and go to:
```
http://localhost:8000/flashcard.html
```

✅ **Done!** The app is now running and the camera works for QR scanning!

---

## How to Use the App

### Starting the Server
After the first setup, you only need to run:
```bash
cd ~/flashcard
python server.py
```

### Stopping the Server
Press `Ctrl+C` in the Termux terminal.

### Keeping the Server Running
To keep the server running when you switch to other apps:
```bash
termux-wake-lock
cd ~/flashcard
python server.py
```

To stop the wake lock later:
```bash
termux-wake-unlock
```

---

## Sharing with Other Devices

To access the app from another device on the same WiFi network:

1. Find your phone's IP address:
   ```bash
   ifconfig
   ```
   Look for `wlan0` and find the `inet` address (like `192.168.1.100`)

2. On the other device, open a browser and go to:
   ```
   http://192.168.1.100:8000/flashcard.html
   ```
   (Replace with your actual IP address)

---

## Updating the App

To get the latest version:
```bash
cd ~/flashcard
rm -rf *
wget https://github.com/jjmm3282006-commits/Flash-C/archive/refs/heads/cross-device-web-app-development-7ebac.zip
unzip cross-device-web-app-development-7ebac.zip
mv Flash-C-cross-device-web-app-development-7ebac/* .
rm -rf Flash-C-cross-device-web-app-development-7ebac cross-device-web-app-development-7ebac.zip
chmod +x server.py
python server.py
```

---

## Troubleshooting

### "Port 8000 already in use"
The server is already running. Either:
- Stop it first with `Ctrl+C`, then start again
- Or use a different port by editing `server.py` and changing `PORT = 8000` to `PORT = 8080`

### "wget: command not found"
Run: `pkg install wget -y`

### "python: command not found"
Run: `pkg install python -y`

### "unzip: command not found"
Run: `pkg install unzip -y`

### Camera still not working
Make sure you're accessing via `http://localhost:8000/flashcard.html` and NOT opening the HTML file directly. The camera only works when served through the local server.

### "Permission denied"
Run: `chmod +x server.py`

### Can't find the files
Check you're in the right folder:
```bash
cd ~/flashcard
ls
```
You should see `flashcard.html` and `server.py`

---

## Alternative: Manual File Transfer

If you prefer to download files separately:

1. Download these files to your phone's Downloads folder:
   - `flashcard.html`
   - `server.py`

2. In Termux, run:
   ```bash
   termux-setup-storage
   ```
   (Tap "Allow" when prompted)

3. Copy the files:
   ```bash
   mkdir -p ~/flashcard
   cd ~/flashcard
   cp ~/storage/downloads/flashcard.html .
   cp ~/storage/downloads/server.py .
   chmod +x server.py
   python server.py
   ```

4. Open: `http://localhost:8000/flashcard.html`

---

## Need Help?

If you're stuck, here's what to check:
1. ✅ Termux is installed from F-Droid or GitHub (not Play Store)
2. ✅ You ran the full setup command
3. ✅ You see "Starting server on http://localhost:8000"
4. ✅ You're opening `http://localhost:8000/flashcard.html` in your browser
5. ✅ You granted camera permission when prompted
