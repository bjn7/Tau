# Tau

[![Release](https://github.com/bjn7/tau/actions/workflows/release.yml/badge.svg)](https://github.com/bjn7/tau/actions/workflows/release.yml)
[![Release](https://img.shields.io/github/v/release/bjn7/tau?include_prereleases)](https://github.com/bjn7/Tau/releases)
[![License](https://img.shields.io/github/license/bjn7/tau)](https://github.com/bjn7/Tau/blob/main/LICENSE)
[![Issues](https://img.shields.io/github/issues-raw/bjn7/tau)](https://github.com/bjn7/Tau/issues)

Tau is an authentication application that generates time-based one-time passcodes (TOTP), available for Windows, Linux, and macOS.

## Features

- **Cross-Platform**: Available for Windows, Linux, and macOS.
- **QR Code Scan**: Add accounts by scanning QR codes.
- **Manual Add**: Enter account details manually.
- **Friendly UI**: Easy-to-use interface.
- **Export and Import**: Manage your accounts by exporting and importing data.
- **Open Source**: Free to use and contribute to.

## Usage

1. Launch Tau from your applications menu.
2. Add a new account by scanning the QR code or entering the key manually.
3. Use Tau to generate time-based one-time passwords (TOTP) for your accounts.
4. Double click to copy code.
5. Past or entry you code in the required platform

## Screenshots

  <img src="https://raw.githubusercontent.com/bjn7/Tau/main/static/Main.png"/>
  <img src="https://raw.githubusercontent.com/bjn7/Tau/main/static/Menu.png"/>
  <img src="https://raw.githubusercontent.com/bjn7/Tau/main/static/Manual.png"/>

## Installation

- **Windows**: Download the installer`.exe` or `.msi` from [releases](https://github.com/bjn7/Tau/releases) and run it.  
  If you encounter a Windows SmartScreen warning, it’s because I haven't purchased a Microsoft code-signing certificate yet. The app is safe to use, as the source code is available for review, and you can also scan it with VirusTotal.

  To install:

  1. Click "More info."
  2. Click "Run anyway."

  Here's an example of the SmartScreen prompt:
  <img src="https://raw.githubusercontent.com/bjn7/Tau/main/windowsSmartscreen.png"/>

- **Linux**: Download the `.AppImage` or `.deb` file from [releases](https://github.com/bjn7/Tau/releases) and install it.
- **macOS**: Download the `.dmg` file from [releases](https://github.com/bjn7/Tau/releases), then drag **Tau** to your Applications folder.

**TODO**

- [ ] Optimize code further
- [ ] Add backup option
- [ ] Implement delete function
- [ ] Add password protection
- [ ] Support `otpauth://` URL scheme for the app
- [ ] Add loading card
- [ ] Implement a splash screen
