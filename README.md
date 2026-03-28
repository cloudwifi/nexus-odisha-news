# Nexus Odisha News - Setup & Admin Guide

This document provides step-by-step instructions to run the **Nexus Odisha News** platform on your local system and manage it via the Admin Panel.

---

## 1. Prerequisites
Before you begin, ensure you have the following installed:
*   **Node.js** (Version 18.0 or higher)
*   **npm** (Node Package Manager, usually installed with Node.js)

---

## 2. Local Installation

### Step 1: Prepare the Project Folder
1.  Download or extract the project files into a folder on your computer (e.g., `C:\Projects\NexusOdishaNews`).
2.  Open your **Terminal** or **Command Prompt**.
3.  Navigate to the project folder:
    ```bash
    cd path/to/your/project-folder
    ```

### Step 2: Install Dependencies
Run the following command to install all necessary libraries (Express, React, SQLite, etc.):
```bash
npm install
```

### Step 3: Setup Environment Variables
1.  In the root folder, create a new file named `.env`.
2.  Open `.env` in a text editor and add the following (you can copy this from `.env.example`):
    ```env
    GEMINI_API_KEY="YOUR_KEY_HERE"
    APP_URL="http://localhost:3000"
    ```
    *Note: The app will run even if you leave the Gemini key blank.*

---

## 3. Running the Application

### Start Development Server
Run the following command in your terminal:
```bash
npm run dev
```
The server will start, and you will see a message: `Server running on http://localhost:3000`.

---

## 4. Accessing the Platform

### Public Website
Open your web browser and go to:
**[http://localhost:3000](http://localhost:3000)**

### Admin Panel (Hidden)
To access the administrative dashboard:
1.  In your browser's address bar, type: **[http://localhost:3000/admin](http://localhost:3000/admin)**
2.  You will be prompted to log in.

**Default Login Credentials:**
*   **Username:** `admin`
*   **Password:** `nexus123`

---

## 5. Using the Admin Panel

Once logged in, you can manage the entire website:

### A. Uploading News with Photos
1.  Click **"Add New News"**.
2.  Enter the **Title** and **Content**.
3.  Click **"Choose File"** under **News Photo** to select an image from your computer.
4.  Check **"Mark as Breaking News"** if you want it to scroll at the top of the site.
5.  Click **"Publish News"**.

### B. Adding Video Reports
1.  Switch to the **Videos** tab in the dashboard.
2.  Click **"Add New Video"**.
3.  Enter the **Title** and paste the **YouTube URL**.
4.  The site will automatically generate the thumbnail and link it to your YouTube channel.

### C. Managing Reporters
1.  Switch to the **Reporters** tab.
2.  Add new reporters with their **Unique ID**, **Name**, and **Area**.
3.  Reporters can verify their identity on the public **"Reporter Verification"** page using their ID.

---

## 6. Technical Notes
*   **Database:** All data is stored in `nexus_news.db` (created automatically). Do not delete this file if you want to keep your news history.
*   **Uploaded Images:** All photos you upload are saved in the `uploads/` folder in the project root.
*   **Responsive Design:** The website is optimized for both Mobile and Desktop. You can test the mobile view by resizing your browser window.

---

**Nexus Odisha News** - *Empowering Odisha with Truthful Journalism.*
