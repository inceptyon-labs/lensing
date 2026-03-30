#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "Pulling latest changes..."
git pull

echo "Installing dependencies..."
pnpm install --frozen-lockfile

echo "Restarting services..."
sudo systemctl restart lensing-host
sudo systemctl restart lensing-kiosk

echo "Done! Services restarted."
