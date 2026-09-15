# Flashcard Maker - Termux Setup Guide

## Quick Setup for Android (Termux)

### 1. Install Termux
Download from F-Droid or GitHub: https://github.com/termux/termux-app

### 2. Install Python
```bash
pkg update
pkg install python
```

### 3. Navigate to your flashcard folder
```bash
cd /storage/emulated/0/Download/flashcard
# Or wherever you saved the files
```

### 4. Make server script executable
```bash
chmod +x server.py
```

### 5. Start the server
```bash
python server.py
```

### 6. Open in browser
Open Chrome and go to:
```
http://localhost:8000/flashcard.html
```

The camera will now work for QR scanning!

## One-Line Setup (Copy & Paste)
```bash
pkg update && pkg install python -y && python server.py
```

## Stop the Server
Press `Ctrl+C` in the Termux terminal

## Keep Server Running
To keep the server running even when you switch apps:
```bash
termux-wake-lock
python server.py
```

To release the wake lock when done:
```bash
termux-wake-unlock
```

## Access from Other Devices
To access from another device on the same network:
1. Find your phone's IP: `ifconfig`
2. Use: `http://YOUR_IP:8000/flashcard.html`

## Troubleshooting

**Port already in use?**
Change the port in `server.py`:
```python
PORT = 8080  # or any other port
```

**Can't access files?**
Make sure you're in the correct directory:
```bash
pwd  # Check current directory
ls   # List files
```

**Camera still not working?**
Make sure you're using `http://localhost:8000` not `file://`
