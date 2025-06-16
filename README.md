# 📚 MoodVerse – Mood-Based Book Discovery App

Welcome to **MoodVerse**, a full-stack web application that helps users discover and share books based on their current mood. Whether you're feeling joyful, calm, adventurous, or introspective – MoodVerse finds the perfect read for you!

![MoodVerse Screenshot](public/assets/preview.png)

---

## 🔗 Live Demo
> _Coming soon or hosted URL here_  
> 🌐 [Visit MoodVerse](#)

---

## ✨ Features

- 🔍 **Mood-Based Book Discovery** – Filter and explore books by mood tags.
- ➕ **Add & Manage Your Books** – Submit books with cover images and tags.
- 👤 **Authentication** – Secure login and logout functionality.
- 💬 **Contact Form** – Users can reach out with queries (MongoDB-backed).
- 📷 **Image Uploads** – Upload local book cover images (up to 2MB).
- 🌐 **Responsive Design** – Optimized for all screen sizes including mobile.
- 🔒 **Session Management** – User session support with personalized content.

---

## 🧰 Tech Stack

### 🌐 Frontend
- HTML5, CSS3 (Custom Responsive Styling)
- Embedded JavaScript Templates (EJS)

### 🔧 Backend
- Node.js + Express.js
- MongoDB + Mongoose (NoSQL DB)
- Express-Session + Flash Messages

### 📦 Other Tools
- Multer for Image Uploads
- Moment-Timezone for IST Date Formatting
- Git & GitHub for Version Control

---

## 📁 Project Structure

```bash
MoodVerse/
│
├── public/
│   └── uploads/             # User-uploaded book images
├── routes/
│   └── bookRoutes.js        # Core routing for book CRUD
├── models/
│   └── Book.js              # Mongoose schema for books
│   └── Query.js             # Schema for contact messages
├── views/
│   └── partials/            # header.ejs, footer.ejs
│   └── home.ejs             # Home layout
│   └── myBooks.ejs          # My Books page
├── app.js                   # Entry point of the app
├── styles.css               # Custom global stylesheet
└── README.md                # You're here!
