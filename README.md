# AExam

## 🚀 Full-Stack Project
AExam is a full-stack application built with **Next.js** and **PostgreSQL**, featuring authentication, category management, products, user roles, and a cart system.

---

## 📌 Prerequisites
Ensure you have the following installed before proceeding:
- **Node.js** (v16 or later) - [Download](https://nodejs.org/)
- **PostgreSQL** - [Download](https://www.postgresql.org/download/)
- **DBeaver** (or any other PostgreSQL GUI) - [Download](https://dbeaver.io/download/)

---

## 🔧 Installation Guide
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/AbbassNurLDin23/aexam.git
```

### 2️⃣ Frontend Setup (Next.js + Tailwind CSS)
1. Navigate to the frontend directory:
   ```sh
   cd FE/my-next-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Install Tailwind CSS:
   ```sh
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Open `http://localhost:3000/` in your browser.

### 3️⃣ Configure Database Connection
- Ensure that your **PostgreSQL database** is correctly set up.
- Update the **backend database properties** to match your database credentials.
---

## 📦 Features
### 🛠 Backend
- **Authentication**: Users authenticate using JWT.
- **User Roles**: Admins and App Users with role-based access control.
- **Category & Products**: CRUD operations for categories and products.
- **Cart System**: Users can manage their cart.

### 🎨 Frontend
- **Dynamic UI**: The UI adapts based on user roles (Admin/User).
- **Full API Integration**: All backend features are integrated into the frontend.
- **Tailwind CSS**: Responsive and modern styling.
- **Drag & Drop**: Enhanced UX with drag-and-drop functionality.

---

## ⚡ Usage
- **Admin**: Can manage categories, products, and users.
- **User**: Can browse products, add items to the cart, and make purchases.

---

## 🤝 Contributing
Feel free to fork and contribute! Open a pull request with your changes.

---

## 📜 License
This project is licensed under the **MIT License**.

