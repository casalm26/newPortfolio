# Server Setup Instructions for Portfolio Website

## Prerequisites

- You have root or sudo access to an Ubuntu server (22.04 LTS recommended)
- You have a domain name (e.g., yourname.com) pointed to your server's IP address
- You have the GitHub repository URL for your portfolio project

## Step 1: Initial Server Access and Updates

```bash
# First, update your server's package list and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl git wget nano
```

## Step 2: Download and Run the Automated Setup Script

```bash
# Navigate to your home directory
cd ~

# Download the setup script from your repository
# Replace YOUR_GITHUB_USERNAME and YOUR_REPO_NAME with your actual values
wget https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/main/deploy/setup-server.sh

# Make the script executable
chmod +x setup-server.sh

# Run the setup script as root
sudo ./setup-server.sh
```

## Step 3: Answer the Setup Script Questions

The script will ask you several questions. Here's what to enter:

1. **Domain name**: Enter your domain (e.g., `yourname.com`)
2. **Git repository URL**: Enter your GitHub repo URL (e.g., `https://github.com/yourusername/portfolio.git`)
3. **Deployment type**:
   - Choose `1` for Static Export (recommended for beginners - simpler, faster)
   - Choose `2` for Node.js Server (if you need dynamic features)

## Step 4: Wait for Installation

The script will now automatically:

- Install Node.js, Nginx, and other required software
- Create a secure user for running the application
- Set up your firewall
- Clone your repository
- Build your website
- Configure the web server
- Set up SSL certificates for HTTPS

This process will take 5-10 minutes. You'll see progress messages as it works.

## Step 5: Configure Environment Variables

After the setup completes, you need to edit the environment file:

```bash
# Open the environment file for editing
sudo nano /var/www/portfolio/.env.production
```

At minimum, update these values:

```
NEXT_PUBLIC_BASE_URL=https://your-actual-domain.com
```

Add any other API keys or configuration your site needs.

Save the file:

- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

## Step 6: Rebuild the Application

After updating environment variables, rebuild your application:

```bash
# Navigate to the project directory
cd /var/www/portfolio

# Switch to the deploy user
sudo su - deploy

# Pull any recent changes from your repository
cd /var/www/portfolio
git pull origin main

# Install dependencies and rebuild
npm ci --production=false
npm run build

# Exit back to your regular user
exit
```

## Step 7: Verify the Deployment

Check if your website is working:

```bash
# Test locally on the server
curl -I http://localhost

# Check Nginx status
sudo systemctl status nginx

# For Node.js deployments, check PM2 status
pm2 status
```

Visit your domain in a web browser: `https://your-domain.com`

## Step 8: Set Up Automatic Deployments (Optional but Recommended)

### Option A: Simple Git-based Deployment

Set up a bare Git repository for easy deployments:

```bash
# Create a bare repository
sudo su - deploy
mkdir -p ~/portfolio.git
cd ~/portfolio.git
git init --bare

# Copy the deployment hook
cat > hooks/post-receive << 'EOF'
#!/bin/bash
cd /var/www/portfolio
git pull origin main
npm ci --production=false
npm run build
echo "Deployment complete!"
EOF

chmod +x hooks/post-receive
exit
```

Now, from your local computer, you can add this as a remote and deploy:

```bash
# On your local computer (not the server)
git remote add production deploy@your-server.com:portfolio.git
git push production main
```

### Option B: GitHub Webhook (Advanced)

If you want automatic deployment when you push to GitHub:

```bash
# Install webhook listener
sudo npm install -g github-webhook-handler

# Create webhook service
sudo nano /etc/systemd/system/webhook.service
```

Add this content:

```ini
[Unit]
Description=GitHub Webhook
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/portfolio
ExecStart=/usr/bin/node /var/www/portfolio/deploy-webhook.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable webhook
sudo systemctl start webhook
```

## Step 9: Set Up Monitoring

Enable basic monitoring to alert you of issues:

```bash
# The setup script already created a monitoring script
# Check it's working
sudo /usr/local/bin/monitor-portfolio.sh

# View monitoring logs
sudo tail -f /var/log/portfolio-monitor.log
```

## Step 10: Regular Maintenance

### Weekly Tasks

```bash
# Check for security updates
sudo apt update
sudo apt list --upgradable

# Check disk space
df -h

# Check application logs
pm2 logs --lines 50  # For Node.js deployment
sudo tail -f /var/log/nginx/error.log  # For any deployment
```

### Monthly Tasks

```bash
# Update all packages
sudo apt update && sudo apt upgrade -y

# Check SSL certificate renewal
sudo certbot certificates

# Clean up old logs
sudo journalctl --vacuum-time=30d
```

## Troubleshooting Common Issues

### Website Not Loading

```bash
# Check if Nginx is running
sudo systemctl status nginx

# If not running, start it
sudo systemctl start nginx

# Check for configuration errors
sudo nginx -t
```

### 502 Bad Gateway Error (Node.js deployment only)

```bash
# Check if the Node.js app is running
pm2 status

# If not running or errored, restart it
pm2 restart all

# Check logs for errors
pm2 logs --lines 100
```

### SSL Certificate Issues

```bash
# Manually renew certificate
sudo certbot renew --force-renewal

# Restart Nginx after renewal
sudo systemctl restart nginx
```

### Permission Errors

```bash
# Fix ownership of files
sudo chown -R deploy:www-data /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio
```

## Getting Help

If something goes wrong:

1. Check the logs:

   ```bash
   # Nginx logs
   sudo tail -f /var/log/nginx/error.log

   # Application logs (Node.js)
   pm2 logs

   # System logs
   sudo journalctl -xe
   ```

2. Test each component:

   ```bash
   # Test Nginx configuration
   sudo nginx -t

   # Test Node.js app (if applicable)
   cd /var/www/portfolio && npm start

   # Test SSL certificate
   sudo certbot certificates
   ```

3. Restart services:
   ```bash
   # Restart everything
   sudo systemctl restart nginx
   pm2 restart all  # For Node.js only
   ```

## Important Security Notes

1. **Never share** your `.env.production` file or its contents
2. **Always use HTTPS** - the setup script configures this automatically
3. **Keep your server updated** - run `sudo apt update && sudo apt upgrade` regularly
4. **Use strong passwords** for your server access
5. **Enable firewall** - the setup script does this automatically

## Success Checklist

After setup, verify:

- [ ] Website loads at https://your-domain.com
- [ ] SSL certificate shows as valid (padlock icon in browser)
- [ ] All pages load correctly
- [ ] Contact forms work (if applicable)
- [ ] No errors in browser console
- [ ] Site loads reasonably fast

## Next Steps After Successful Setup

1. **Test your website thoroughly** - click all links, test all features
2. **Set up backups** - consider automated daily backups
3. **Configure monitoring** - set up uptime monitoring (e.g., UptimeRobot)
4. **Document any customizations** you make
5. **Plan for updates** - schedule regular maintenance windows

---

## Quick Command Reference

```bash
# Check status
sudo systemctl status nginx
pm2 status  # Node.js only

# View logs
sudo tail -f /var/log/nginx/error.log
pm2 logs  # Node.js only

# Restart services
sudo systemctl restart nginx
pm2 restart all  # Node.js only

# Deploy updates (after git remote setup)
git push production main  # From your local computer

# Manual update on server
cd /var/www/portfolio
git pull origin main
npm ci && npm run build
pm2 restart all  # Node.js only
```

---

**Remember**: The automated setup script handles most of the complex configuration. If you encounter issues, the logs will usually tell you what's wrong. Don't hesitate to restart services or re-run the setup script if needed.
