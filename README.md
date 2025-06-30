# 📚 MoodVerse – Mood-Based Book Discovery App

Welcome to **MoodVerse**, a full-stack web application that helps users discover and share books based on their current mood. Whether you're feeling joyful, calm, adventurous, or introspective – MoodVerse finds the perfect read for you!

![MoodVerse Screenshot](public/assets/preview.png)

---

## 🔗 Live Demo

> 🌐 **[Visit MoodVerse](https://moodverse.onrender.com/)**  
> 🤗 **[View Hugging Face ML Space](https://huggingface.co/spaces/Aakrist2511/moodverse-ml)**

---

## ✨ Features

- 🔍 **Mood-Based Book Discovery** – Filter and explore books by mood tags.
- ➕ **Add & Manage Your Books** – Submit books with cover images, mood tags, and PDFs.
- 📖 **Read Books Online** – View uploaded PDF books securely within the app.
- 🗃️ **Upload PDFs & Images** – Upload your own book PDFs and cover images (stored in Cloudinary).
- 🤖 **ML Book Recommender API** – Integrated with Hugging Face to provide semantic mood-based book recommendations.
- 👤 **Authentication** – Secure signup, login, and logout functionality.
- 💬 **Contact Form** – Users can reach out with queries (MongoDB-backed).
- 🌐 **Responsive Design** – Optimized for all screen sizes.
- 🔒 **Session Management** – User session support with personalized content.

---

## 🧠 Machine Learning Integration

This project integrates a **custom ML model hosted on Hugging Face**, enabling:

- **Semantic book recommendations** based on mood inputs.
- **Live API calls** to the deployed ML model for real-time recommendations.

> ✅ **Hugging Face Space URL:** [https://huggingface.co/spaces/Aakrist2511/moodverse-ml](https://huggingface.co/spaces/Aakrist2511/moodverse-ml)

---

## 🧰 Tech Stack

### 🌐 Frontend

- HTML5, CSS3 (Custom Responsive Styling)
- Embedded JavaScript Templates (EJS)

### 🔧 Backend

- Node.js + Express.js
- MongoDB + Mongoose (NoSQL DB)
- Express-Session + Flash Messages

### 📦 Other Tools & Integrations

- Multer + Cloudinary for PDF & Image uploads
- Hugging Face for ML-based recommendations
- Moment-Timezone for IST Date Formatting
- Git & GitHub for Version Control

---

## 📁 Project Structure

```plaintext
MoodVerse/
│
├── models/
│   ├── books.js
│   ├── query.js
│   └── user.js
│
├── node_modules/
│
├── public/
│   ├── CSS/
│   │   └── styles.css
│   └── uploads/
│
├── routes/
│   ├── bookRoutes.js
│   ├── chatbot.js
│   └── cloudinaryConfig.js
│
├── views/
│   ├── partials/
│   │   ├── footer.ejs
│   │   └── header.ejs
│   ├── about.ejs
│   ├── addBook.ejs
│   ├── bookDetail.ejs
│   ├── bookList.ejs
│   ├── chatbot.ejs
│   ├── editBook.ejs
│   ├── home.ejs
│   ├── login.ejs
│   ├── myBooks.ejs
│   ├── noBooksFound.ejs
│   ├── searchResults.ejs
│   └── signup.ejs
│
├── .env
├── app.js
├── package.json
├── package-lock.json
└── README.md
