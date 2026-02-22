#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Installing Lensing systemd service units..."

# Copy service files to systemd directory
cp "${SCRIPT_DIR}/lensing-host.service" /etc/systemd/system/lensing-host.service
cp "${SCRIPT_DIR}/lensing-kiosk.service" /etc/systemd/system/lensing-kiosk.service

echo "Service files installed to /etc/systemd/system/"

# Reload systemd daemon to pick up new units
systemctl daemon-reload

echo "systemd daemon reloaded"

# Enable services for auto-start on boot
systemctl enable lensing-host
systemctl enable lensing-kiosk

echo "Services enabled for auto-start:"
echo "  lensing-host.service"
echo "  lensing-kiosk.service"
echo ""
echo "To start now, run:"
echo "  sudo systemctl start lensing-host"
echo "  sudo systemctl start lensing-kiosk"
