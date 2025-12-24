# MongoDB Setup Guide - Easy Steps

## Option 1: MongoDB Atlas (Cloud - Easiest for Beginners)

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/atlas
2. Click "Try Free" and create account
3. Use Google/GitHub login for faster setup

### Step 2: Create Cluster (FREE)
1. Choose "M0" FREE tier
2. Select any cloud provider (AWS/Google/Azure)
3. Choose region closest to you
4. Click "Create Cluster" (takes 2-3 minutes)

### Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)

### Step 4: Update Config File
Edit `backend/config.js` and replace:
```javascript
mongodb: {
  uri: 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/your-database-name?retryWrites=true&w=majority'
}
```

Replace with your actual connection string from Step 3.

## Option 2: Local MongoDB (If you prefer)

### Step 1: Install MongoDB
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer (choose "Complete" setup)
3. Install MongoDB Compass (GUI tool - optional but helpful)

### Step 2: Start MongoDB
1. Open Command Prompt as Administrator
2. Run: `net start MongoDB`
3. Or use: `mongod` (starts MongoDB service)

### Step 3: Update Config File
Edit `backend/config.js` and use:
```javascript
mongodb: {
  uri: 'mongodb://localhost:27017/mydatabase'
}
```

## Final Steps

1. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start Backend Server:**
   ```bash
   npm run dev
   ```

3. **Test Connection:**
   - Open browser: http://localhost:8000/health
   - Should show: `{"status":"OK","message":"Server is running"}`

## Troubleshooting

**If connection fails:**
- Check MongoDB is running
- Verify connection string in config.js
- Make sure no other app is using port 27017 (MongoDB) or 8000 (backend)

**Need help?**
- MongoDB Atlas has great documentation
- You can use MongoDB Compass to visually see your database
