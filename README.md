# ⚡ Decentralized Energy Marketplace

![Energy Marketplace](screenshot.png) <!-- Add your project screenshot here -->

A blockchain-powered peer-to-peer energy trading platform enabling direct transactions between producers and consumers. Built for [Hackathon Name] 2025, focusing on sustainable energy solutions and blockchain technology.

## 🌟 Key Features

- **P2P Energy Trading**: Direct energy transactions between producers and consumers
- **Real-time Monitoring**: Live tracking of energy production and consumption
- **Interactive Dashboard**: Advanced visualization of market trends and trading history
- **Leaderboard System**: Competitive rankings for top energy producers
- **Secure Authentication**: Role-based access for producers and consumers
- **QR Wallet Integration**: Seamless blockchain wallet connectivity
- **Modern UI**: Responsive design with smooth animations and glass-morphism effects

## 🛠️ Technology Stack

### Frontend
- React.js with Vite
- Tailwind CSS & Shadcn/UI
- Web3.js for blockchain integration
- Recharts for data visualization
- Lucide React icons
- Framer Motion for animations
- QRCode.react for wallet integration

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt password hashing
- CORS security

### Blockchain
- Ethereum Network
- MetaMask Integration
- Smart Contract Infrastructure

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB
- MetaMask wallet
- npm or yarn package manager

## 🚀 Installation & Setup

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/energy-marketplace.git
cd energy-marketplace
```

2. **Install Dependencies**
```bash
# Frontend setup
cd client
npm install

# Backend setup
cd ../server
npm install
```

3. **Environment Configuration**

Create `.env` file in server directory:
```env
MONGODB_URI=your_mongodb_uri
PORT=5001
```

4. **Launch Application**
```bash
# Start backend
cd server
npm start

# Start frontend (new terminal)
cd client
npm run dev
```

5. **Access Points**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## 📁 Project Architecture

```
energy-marketplace/
├── client/                      # Frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── assets/            # Static resources
│   │   ├── backgroundPatterns/ # SVG patterns
│   │   ├── styles/            # CSS & styling
│   │   └── lib/               # Utilities
└── server/                     # Backend application
    ├── models/                # Database schemas
    ├── routes/                # API endpoints
    ├── controllers/           # Business logic
    └── server.js              # Entry point
```

## 💡 How It Works

1. **User Onboarding**
   - Register as producer or consumer
   - Connect Ethereum wallet via QR code
   - Secure authentication system

2. **Energy Trading**
   - Producers list available energy with price and duration
   - Consumers browse and purchase energy using ETH
   - Real-time transaction processing

3. **Market Features**
   - Live energy production tracking
   - Competitive producer leaderboard
   - Historical data visualization
   - Market trend analysis

## 🔒 Security Measures

- Encrypted password storage
- JWT-based authentication
- Secure wallet connections
- Input validation
- CORS protection
- Rate limiting

## 🌐 API Documentation

### Authentication
- `POST /api/register` - New user registration
- `POST /api/login` - User authentication

### Energy Trading
- `GET /api/energy-offers` - List active offers
- `POST /api/list-energy` - Create energy listing
- `POST /api/purchase-energy` - Execute purchase
- `GET /api/leaderboard` - View top producers

## 🎯 Future Roadmap

- [ ] Real-time energy monitoring integration
- [ ] Multiple energy type support
- [ ] Mobile application development
- [ ] Smart meter integration
- [ ] Dynamic pricing algorithm
- [ ] Renewable energy certificates
- [ ] Cross-chain compatibility

## 👥 Team

- [Name] - Full Stack Developer & Project Lead
- [Name] - Blockchain Developer
- [Name] - UI/UX Designer
- [Name] - Backend Architecture

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md)

## 📧 Contact & Support

- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Project Link**: [https://github.com/yourusername/energy-marketplace](https://github.com/yourusername/energy-marketplace)

---

Built with ⚡ for sustainable energy future
