#!/bin/bash
set -e
echo "Restarting services..."
sudo systemctl restart lensing-host
sudo systemctl restart lensing-kiosk
echo "Done!"
