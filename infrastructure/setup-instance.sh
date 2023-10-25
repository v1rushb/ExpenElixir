#!/bin/sh
set -e

sudo apt update
sudo apt upgrade -y

sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings

# install docker
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
# Add the repository to Apt sources:
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# create github user
sudo mkdir -p /home/app
sudo useradd --no-create-home --home-dir /home/app --shell /bin/bash github
sudo usermod --append --groups docker github
sudo usermod --append --groups docker ubuntu
sudo chown github:github -R /home/app

github_pubkey="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIM+pNBrYA5qN/PFsK7J5dCDMpfHPGdV7lEgGiF8mcINk 211111@ppu.edu.ps"

sudo -u github sh -c "mkdir -p /home/app/.ssh && echo $github_pubkey > /home/app/.ssh/authorized_keys"

sudo reboot
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install --update

# Fetch GitHub Token from AWS SSM
github_token=$(aws ssm get-parameter --name "GitHubToken" --with-decryption --query "Parameter.Value" --output text)

# Trigger GitHub Actions workflow
curl -X POST "https://api.github.com/repos/V1rushB/ExpenElixir/dispatches" \
     -H "Accept: application/vnd.github.everest-preview+json" \
     -H "Authorization: token $github_token" \
     --data "{\"event_type\": \"deploy_event\", \"client_payload\": { \"ip\": \"$(curl -s ifconfig.me)\" }}"

sudo reboot
