#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
import urllib.request
import json
import zipfile
import shutil
import argparse

PORT = 8000
GITHUB_REPO = "jjmm3282006-commits/Flash-C"
GITHUB_BRANCH = "cross-device-web-app-development-7ebac"
VERSION_FILE = "version.txt"

def get_current_version():
    """Get the current version from version.txt"""
    try:
        with open(VERSION_FILE, 'r') as f:
            return f.read().strip()
    except:
        return "0.0.0"

def check_for_updates():
    """Check GitHub for the latest version"""
    try:
        url = f"https://api.github.com/repos/{GITHUB_REPO}/commits/{GITHUB_BRANCH}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Flashcard-App'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            return data['sha'][:7]  # Return short commit hash as version
    except Exception as e:
        print(f"Could not check for updates: {e}")
        return None

def download_and_update():
    """Download and apply updates from GitHub
    Returns: (server_updated, success)
    """
    try:
        print("Downloading update...")
        url = f"https://github.com/{GITHUB_REPO}/archive/refs/heads/{GITHUB_BRANCH}.zip"
        zip_path = "update.zip"
        
        # Download the zip
        urllib.request.urlretrieve(url, zip_path)
        
        # Extract it
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall("temp_update")
        
        # Move files from public folder
        source_dir = f"temp_update/Flash-C-{GITHUB_BRANCH}/public"
        server_updated = False
        
        if os.path.exists(source_dir):
            # Check if server.py will be updated
            new_server_path = os.path.join(source_dir, 'server.py')
            if os.path.exists(new_server_path):
                # Compare server.py files
                with open('server.py', 'rb') as f:
                    old_server = f.read()
                with open(new_server_path, 'rb') as f:
                    new_server = f.read()
                if old_server != new_server:
                    server_updated = True
                    print("Note: server.py has been updated")
            
            # Remove old files except server.py and version.txt
            for item in os.listdir('.'):
                if item not in ['server.py', 'version.txt', 'update.zip', 'temp_update']:
                    if os.path.isfile(item):
                        os.remove(item)
                    elif os.path.isdir(item):
                        shutil.rmtree(item)
            
            # Copy new files
            for item in os.listdir(source_dir):
                src = os.path.join(source_dir, item)
                dst = os.path.join('.', item)
                if os.path.isfile(src):
                    shutil.copy2(src, dst)
                elif os.path.isdir(src):
                    if os.path.exists(dst):
                        shutil.rmtree(dst)
                    shutil.copytree(src, dst)
        
        # Cleanup
        shutil.rmtree("temp_update")
        os.remove(zip_path)
        
        return server_updated, True
    except Exception as e:
        print(f"Update failed: {e}")
        # Cleanup on failure
        if os.path.exists("temp_update"):
            shutil.rmtree("temp_update")
        if os.path.exists("update.zip"):
            os.remove("update.zip")
        return False, False

def auto_update():
    """Check for and apply updates if available"""
    current_version = get_current_version()
    print(f"Current version: {current_version}")
    
    latest_version = check_for_updates()
    if latest_version is None:
        print("Skipping auto-update (could not check)")
        return False, False
    
    print(f"Latest version: {latest_version}")
    
    if current_version != latest_version:
        print(f"New version available! Updating in background...")
        server_updated, success = download_and_update()
        if success:
            # Update version file
            with open(VERSION_FILE, 'w') as f:
                f.write(latest_version)
            if server_updated:
                print("✓ Update complete! server.py was updated - restart required")
                return True, True
            else:
                print("✓ Update complete! Files updated - server continues running")
                return True, False
    else:
        print("You're up to date!")
    
    return False, False

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)
    
    def log_message(self, format, *args):
        # Suppress default logging for cleaner output
        pass

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Flashcard Maker Server')
    parser.add_argument('--no-update', action='store_true', help='Skip auto-update check')
    parser.add_argument('--force-update', action='store_true', help='Force update check')
    args = parser.parse_args()
    
    # Auto-update unless disabled
    if not args.no_update:
        updated, server_updated = auto_update()
        if updated and server_updated and not args.force_update:
            print("\nserver.py was updated. Restarting server...")
            os.execv(sys.executable, ['python'] + sys.argv)
        elif updated and not server_updated:
            print("\n✓ Files updated successfully! Server continues running with new files.")
            print("  (No restart needed - only server.py changes require restart)\n")
    
    print(f"\nStarting server on http://localhost:{PORT}")
    print(f"Open your browser to: http://localhost:{PORT}/flashcard.html")
    print("Press Ctrl+C to stop the server\n")
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")
            sys.exit(0)
