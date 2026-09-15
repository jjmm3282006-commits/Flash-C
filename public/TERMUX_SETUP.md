# Flashcard Maker - Termux Setup Guide

## Quick Setup for Android (Termux) - No Root Required

### Method 1: Download Files Directly in Termux (Recommended)

#### 1. Install Termux
Download from F-Droid or GitHub: https://github.com/termux/termux-app

#### 2. Install Required Packages
```bash
pkg update
pkg install python wget -y
```

#### 3. Create Flashcard Directory
```bash
mkdir -p ~/flashcard
cd ~/flashcard
```

#### 4. Download the Files
If you have the files hosted online (GitHub, etc.):
```bash
wget https://your-host.com/flashcard.html
wget https://your-host.com/server.py
```

**OR** Download from GitHub (replace with your actual repo URL):
```bash
wget https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/flashcard.html
wget https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/server.py
```

#### 5. Make Server Executable
```bash
chmod +x server.py
```

#### 6. Start the Server
```bash
python server.py
```

#### 7. Open in Browser
Open Chrome and go to:
```
http://localhost:8000/flashcard.html
```

The camera will now work for QR scanning!

---

### Method 2: Use Shared Storage (Access Downloads Folder)

#### 1. Grant Storage Permission
```bash
termux-setup-storage
```
Tap "Allow" when prompted.

#### 2. Navigate to Downloads
```bash
cd ~/storage/downloads
```

#### 3. Create Flashcard Folder
```bash
mkdir flashcard
cd flashcard
```

#### 4. Copy Your Files
Now you can copy `flashcard.html` and `server.py` from your phone's Downloads folder to this location using any file manager.

#### 5. Start the Server
```bash
python server.py
```

#### 6. Open in Browser
```
http://localhost:8000/flashcard.html
```

---

### Method 3: Create Files Manually in Termux

If you can't download the files, you can create them directly:

#### 1. Create Directory
```bash
mkdir -p ~/flashcard
cd ~/flashcard
```

#### 2. Create server.py
```bash
cat > server.py << 'EOF'
#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)

print(f"Starting server on http://localhost:{PORT}")
print(f"Open your browser to: http://localhost:{PORT}/flashcard.html")
print("Press Ctrl+C to stop the server")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
        sys.exit(0)
EOF
```

#### 3. Create flashcard.html
You'll need to copy the entire flashcard.html content. Use:
```bash
nano flashcard.html
```
Then paste the entire HTML content, save (Ctrl+O, Enter), and exit (Ctrl+X).

#### 4. Start the Server
```bash
python server.py
```

---

## One-Line Setup (Copy & Paste)

**With existing files:**
```bash
pkg update && pkg install python -y && python server.py
```

**Download and run (replace URL):**
```bash
pkg update && pkg install python wget -y && mkdir -p ~/flashcard && cd ~/flashcard && wget https://your-host.com/flashcard.html && wget https://your-host.com/server.py && python server.py
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

**Permission denied?**
```bash
chmod +x server.py
```

**Can't find files after termux-setup-storage?**
```bash
ls ~/storage/downloads/
```
Make sure files are actually in your Downloads folder.
