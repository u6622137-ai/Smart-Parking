# SmartPark DNS Deployment Setup

## Problem
The raw IP address `20.195.26.45` is being blocked by university firewalls because they categorize unknown IPs as security risks. Using a DNS hostname makes the service appear more legitimate and avoids firewall blocks.

## Solution Overview
1. **Register or assign a DNS name** for your Azure VM
2. **Update Nginx configuration** to use the hostname
3. **Enable SSL/TLS** (optional but recommended)
4. **Update environment variables** if needed

---

## Step 1: Assign a DNS Name to Your Azure VM

### Option A: Use Azure DNS (Recommended)
1. Go to **Azure Portal** → Your VM → **Settings** → **DNS name**
2. Click **Configure** next to "DNS name label"
3. Enter a name (e.g., `smartpark-au`, `parking-portal`)
4. Azure will assign: `smartpark-au.australiaeast.cloudapp.azure.com` (or your region)
5. Your public IP will resolve to this hostname

### Option B: Use External DNS Provider
If you own a domain (e.g., `parking.example.com`):
1. Go to your DNS provider (GoDaddy, Namecheap, Route 53, etc.)
2. Add an **A record** pointing to `20.195.26.45`
3. Example:
   ```
   Type: A
   Name: parking (or subdomain)
   Value: 20.195.26.45
   TTL: 3600
   ```
4. Wait 5-30 minutes for DNS propagation

---

## Step 2: Update Nginx Configuration on Azure VM

SSH into your VM and edit the Nginx config:

```bash
sudo nano /etc/nginx/sites-available/smartpark
```

Replace the configuration with:

```nginx
upstream nextjs_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name smartpark-au.australiaeast.cloudapp.azure.com;  # Replace with your DNS name

    client_max_body_size 10M;

    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Key change:** Update `server_name` to your DNS hostname.

Test and reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 3: (Optional) Enable SSL/TLS with Let's Encrypt

This adds `https://` and further reduces firewall blocks:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate (replace with your DNS name)
sudo certbot certonly --nginx -d smartpark-au.australiaeast.cloudapp.azure.com
```

Update Nginx to use SSL:

```nginx
upstream nextjs_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name smartpark-au.australiaeast.cloudapp.azure.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name smartpark-au.australiaeast.cloudapp.azure.com;

    ssl_certificate /etc/letsencrypt/live/smartpark-au.australiaeast.cloudapp.azure.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/smartpark-au.australiaeast.cloudapp.azure.com/privkey.pem;

    client_max_body_size 10M;

    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Reload Nginx:
```bash
sudo systemctl reload nginx
```

---

## Step 4: Update PM2 & Environment Variables

Your PM2 config should reference the app, not specific hostnames (Nginx handles routing). However, if you have environment variables that reference the server:

1. SSH into VM and edit `.env.local` if it exists:
   ```bash
   nano /home/azureuser/smartpark/.env.local
   ```

2. If any services need the hostname, update them:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/smartpark
   JWT_SECRET=your_secret_key
   # No need to set API_URL here—Next.js handles relative paths
   ```

3. Restart PM2:
   ```bash
   pm2 restart smartpark
   pm2 save
   ```

---

## Step 5: Test Access

After DNS propagates (5-30 minutes):

1. Test DNS resolution:
   ```bash
   nslookup smartpark-au.australiaeast.cloudapp.azure.com
   ```

2. Test from browser:
   - **Before:** `http://20.195.26.45` → **Blocked**
   - **After:** `http://smartpark-au.australiaeast.cloudapp.azure.com` → **Should work**

3. If using SSL:
   ```
   https://smartpark-au.australiaeast.cloudapp.azure.com
   ```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| DNS not resolving | Wait longer for propagation, or verify A record in your DNS provider |
| Nginx returns 502 | Check if Next.js is running: `pm2 list` |
| Still blocked by firewall | Contact IT department with the new hostname; they may whitelist it faster since it's registered DNS |
| SSL certificate fails | Ensure Nginx can reach port 80 (required for Let's Encrypt validation) |

---

## Updated README Production URL

Update your README to reflect the DNS hostname:

```markdown
## Production URL
- https://smartpark-au.australiaeast.cloudapp.azure.com
```

This hostname-based access should bypass the university firewall's IP-based filtering!
