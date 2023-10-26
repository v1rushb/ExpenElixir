#!/bin/sh
set -e

# Update and install necessary packages
sudo apt update
sudo apt upgrade -y
sudo apt-get install -y ca-certificates curl gnupg docker-compose unzip

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Create GitHub user
sudo mkdir -p /home/app
sudo useradd --no-create-home --home-dir /home/app --shell /bin/bash github
sudo usermod --append --groups docker github
sudo usermod --append --groups docker ubuntu
sudo chown github:github -R /home/app

# Setup SSH key for GitHub
github_pubkey="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBbZCNZaIOeEpTjiV7VeNfgk/8HTN5BafA6UcslURQDL 211111@ppu.edu.ps"
sudo -u github sh -c "mkdir -p /home/app/.ssh && echo $github_pubkey > /home/app/.ssh/authorized_keys"

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install --update

# Create the script to run after reboot
cat <<EOL > /home/app/rebootScript.sh
#!/bin/bash
docker stop ExpenElixir
docker rm ExpenElixir

github_token=\$(aws ssm get-parameter --name "GitHubToken" --with-decryption --query "Parameter.Value" --output text)

# Trigger GitHub Actions workflow
curl -X POST "https://api.github.com/repos/V1rushB/ExpenElixir/dispatches" \
     -H "Accept: application/vnd.github.everest-preview+json" \
     -H "Authorization: token \$github_token" \
     --data "{\"event_type\": \"deploy_event\", \"client_payload\": { \"ip\": \"\$(curl -s ifconfig.me)\", \"image_version\": \"latest\" }}"
EOL

chmod +x /home/app/rebootScript.sh

# Schedule the script to run on every reboot
(crontab -l 2>/dev/null; echo "@reboot /home/app/rebootScript.sh") | crontab -

# Reboot the instance
sudo reboot
