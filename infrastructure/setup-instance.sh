#!/bin/sh
set -e

# Update and upgrade packages
sudo apt update
sudo apt upgrade -y

# Install necessary packages
sudo apt-get install -y ca-certificates curl gnupg sudo

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose

# Create the "github" user
sudo mkdir -p /home/app
sudo useradd --create-home --home-dir /home/app --shell /bin/bash github

# Add the "github" user to the "sudo" group to grant sudo privileges
sudo usermod -aG sudo github

# Set up SSH key for the "github" user
github_pubkey="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIM+pNBrYA5qN/PFsK7J5dCDMpfHPGdV7lEgGiF8mcINk 211111@ppu.edu.ps"
sudo -u github sh -c "mkdir -p /home/app/.ssh && echo $github_pubkey > /home/app/.ssh/authorized_keys"

# Reboot to apply changes
sudo reboot
