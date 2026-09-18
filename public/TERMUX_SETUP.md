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
pkg update -y && pkg install python wget unzip -y && mkdir -p ~/flashcard && cd ~/flashcard && wget https://github.com/jjmm3282006-commits/Flash-C/archive/refs/heads/cross-device-web-app-development-7ebac.zip && unzip cross-device-web-app-development-7ebac.zip && cd Flash-C-cross-device-web-app-development-7ebac/public && mv * ../../ && cd ../../ && rm -rf Flash-C-cross-device-web-app-development-7ebac cross-device-web-app-development-7ebac.zip && chmod +x server.py && printf '#!/bin/bash\nif [ "$1" = "fc" ] && [ "$2" = "server" ]; then\n  cd ~/flashcard && python server.py "${@:3}"\nelse\n  echo "Usage: run fc server"\n  echo "  Starts the Flashcard Maker server"\n  echo ""\n  echo "Options:"\n  echo "  run fc server --force-update    Force check for updates"\n  echo "  run fc server --no-update       Skip auto-update check"\nfi' > /data/data/com.termux/files/usr/bin/run && chmod +x /data/data/com.termux/files/usr/bin/run && echo "✓ Installation complete! You can now use 'run fc server' to start the app" && python server.py
```

**What this does:**
- Updates Termux packages
- Installs Python and download tools
- Downloads the flashcard app
- Extracts the files from the public folder
- Sets up the `run fc server` command for easy access
- Starts the web server with auto-update enabled

**Note:** The server will automatically check for updates every time it starts. You'll see messages like:
```
Current version: abc1234
Latest version: def5678
New version available! Updating...
Update complete!
```

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
After the first setup, you can simply type:
```bash
run fc server
```

This command was automatically set up during installation. It will start the server from anywhere in Termux.

Alternatively, you can still use the full command:
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
run fc server
```

To stop the wake lock later:
```bash
termux-wake-unlock
```

### About the `run fc server` Command
The `run fc server` command is a script that was automatically set up during installation. It's stored in your system's bin directory and allows you to start the server from anywhere in Termux without navigating to the flashcard folder.

If you ever need to set it up manually (for example, if you reinstall Termux), run:
```bash
printf '#!/bin/bash\nif [ "$1" = "fc" ] && [ "$2" = "server" ]; then\n  cd ~/flashcard && python server.py "${@:3}"\nelse\n  echo "Usage: run fc server"\n  echo "  Starts the Flashcard Maker server"\n  echo ""\n  echo "Options:"\n  echo "  run fc server --force-update    Force check for updates"\n  echo "  run fc server --no-update       Skip auto-update check"\nfi' > /data/data/com.termux/files/usr/bin/run && chmod +x /data/data/com.termux/files/usr/bin/run
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

**Good news!** The app now updates automatically when you start the server. Just run:
```bash
run fc server
```

The server will check for updates and apply them automatically if available. You'll see messages like:
```
Current version: abc1234
Latest version: def5678
New version available! Updating...
Update complete!
```

### Manual Update Options

If you want to force an update check:
```bash
run fc server --force-update
```

If you want to skip the auto-update:
```bash
run fc server --no-update
```

### Manual Update (Fallback)

If auto-update fails, you can manually update:
```bash
cd ~/flashcard
rm -rf *
wget https://github.com/jjmm3282006-commits/Flash-C/archive/refs/heads/cross-device-web-app-development-7ebac.zip
unzip cross-device-web-app-development-7ebac.zip
cd Flash-C-cross-device-web-app-development-7ebac/public
mv * ../../
cd ../../
rm -rf Flash-C-cross-device-web-app-development-7ebac cross-device-web-app-development-7ebac.zip
chmod +x server.py
run fc server
```

---

## Troubleshooting

### "Port 8000 already in use"
The server is already running. Either:
- Stop it first with `Ctrl+C`, then run `run fc server` again
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

### "chmod: cannot access 'server.py': No such file or directory"
This means the files are in a subdirectory. The app files are in the `public/` folder of the repository. Run this to fix it:
```bash
cd ~/flashcard
cd Flash-C-cross-device-web-app-development-7ebac/public
mv * ../../
cd ../../
rm -rf Flash-C-cross-device-web-app-development-7ebac
chmod +x server.py
run fc server
```

---

## Alternative: Manual File Transfer

If you prefer to download files separately:

1. Download these files to your phone's Downloads folder:
   - `flashcard.html` (from the `public/` folder in the repo)
   - `server.py` (from the `public/` folder in the repo)

2. In Termux, run:
   ```bash
   termux-setup-storage
   ```
   (Tap "Allow" when prompted)

3. Copy the files and set up the command:
   ```bash
   mkdir -p ~/flashcard
   cd ~/flashcard
   cp ~/storage/downloads/flashcard.html .
   cp ~/storage/downloads/server.py .
   chmod +x server.py
   printf '#!/bin/bash\nif [ "$1" = "fc" ] && [ "$2" = "server" ]; then\n  cd ~/flashcard && python server.py "${@:3}"\nelse\n  echo "Usage: run fc server"\n  echo "  Starts the Flashcard Maker server"\n  echo ""\n  echo "Options:"\n  echo "  run fc server --force-update    Force check for updates"\n  echo "  run fc server --no-update       Skip auto-update check"\nfi' > /data/data/com.termux/files/usr/bin/run && chmod +x /data/data/com.termux/files/usr/bin/run
   run fc server
   ```

4. Open: `http://localhost:8000/flashcard.html`

**Note:** The `run fc server` command has been set up for you. From now on, you can just type `run fc server` from anywhere to start the server.

---

## Need Help?

If you're stuck, here's what to check:
1. ✅ Termux is installed from F-Droid or GitHub (not Play Store)
2. ✅ You ran the full setup command
3. ✅ You see "Starting server on http://localhost:8000"
4. ✅ You're opening `http://localhost:8000/flashcard.html` in your browser
5. ✅ You granted camera permission when prompted
6. ✅ You can use `run fc server` to start the app from anywhere
