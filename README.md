<div align="center">
  <h1>Tau (𝜏)</h1>
</div>

**Tau** is a free, open-source two-factor authenticator (2FA) application for Windows, Linux, and macOS.

## Features

- **Cross-platform**: Supports **Windows**, **Linux**, and **macOS**.
- **TOTP** (Time-based One-Time Password) support.
- Simple, intuitive user interface.
- Completely free and open source.

## Installation

- **Windows**: Download the installer from [releases](https://github.com/bjn7/Tau/releases) and run it.  
  If you encounter a Windows SmartScreen warning, it’s because I haven't purchased a Microsoft code-signing certificate yet. The app is safe to use, as the source code is available for review, and you can also scan it with VirusTotal.

  To install:

  1. Click "More info."
  2. Click "Run anyway."

  Here's an example of the SmartScreen prompt:
  <img src="https://raw.githubusercontent.com/bjn7/Tau/main/windowsSmartscreen.png"/>

- **Linux**: Download the `.AppImage` or `.deb` file from [releases](https://github.com/bjn7/Tau/releases) and install it.
- **macOS**: Download the `.dmg` file from [releases](https://github.com/bjn7/Tau/releases), then drag **Tau** to your Applications folder.

## To-Do

- Add backup option.
- Implement delete function.
- Add password protection.
- Support `otpauth://` URL scheme for the app.
- Loading Card
- splashscreen
