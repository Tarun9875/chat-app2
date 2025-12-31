💬 Chat Web App (WhatsApp-Like)

A real-time chat web application inspired by WhatsApp Web, built using MERN Stack + Socket.IO.
Supports private chats, group chats, emojis, file sharing, read receipts, online status, and more.

🚀 Features
🔹 Authentication

User registration & login (JWT based)

Secure API routes

🔹 Chat

✅ Private chat (1-to-1)

✅ Group chat

✅ Real-time messaging using Socket.IO

✅ Message delete & copy

✅ Date separators (Today / Yesterday)

🔹 Read Status (WhatsApp style)

✔ Sent

✔✔ Delivered

✔✔ Blue = Seen

🔹 Emoji & Attachments

😀 Emoji picker

📎 Attach files (WhatsApp-style menu)

🖼 Image preview before sending

📄 Document upload

🎵 Audio upload

🔹 UI / UX

WhatsApp Web–like dark theme

Colored attachment icons

Compact attachment menu

Smooth auto-scroll

Online / offline indicator

🛠 Tech Stack
Frontend

⚛️ React

🎨 Material UI (MUI)

😀 emoji-picker-react

📡 Socket.IO Client

Backend

🟢 Node.js

🚂 Express.js

🍃 MongoDB (Mongoose)

📡 Socket.IO Server

🔐 JWT Authentication

📂 Multer (file uploads)

📂 Project Structure
chat-app/
│
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatRoom/
│   │   │   ├── Group/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── socket.js
│   │   └── App.js
│
├── server/                  # Express backend
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Group.js
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   └── server.js
│
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/chat-web-app.git
cd chat-web-app

2️⃣ Backend Setup
cd server
npm install


Create .env file:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chatapp
JWT_SECRET=your_secret_key


Run backend:

npm start

3️⃣ Frontend Setup
cd client
npm install
npm start


Frontend runs on:

http://localhost:3000

🔌 Socket.IO Events
Event	Description
joinRoom	Join private or group room
sendMessage	Send real-time message
receiveMessage	Receive message
messages-seen	Update read receipts
user-online	Online status
📸 Screenshots

WhatsApp-style chat UI

Emoji picker

Attachment menu

Image preview

Read receipts

(Add screenshots here if you want)

🔐 Security

JWT protected APIs

Server-side validation

Secure file uploads

🧪 Future Enhancements

🎙 Voice message recording

↩ Reply to message

⭐ Message reactions

🔍 Message search

📱 Mobile responsive UI

📞 Audio / Video calling

🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first.

📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Rahul / Ruchu
Made with ❤️ using MERN Stack
