import React, { useState, useEffect } from 'react';
import { AlertCircle, Sun, Battery } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Web3 from 'web3';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
// Sample data for the energy chart
const chartData = [
  { time: '12:00', energy: 100 },
  { time: '13:00', energy: 150 },
  { time: '14:00', energy: 200 },
  { time: '15:00', energy: 180 },
  { time: '16:00', energy: 220 },
  { time: '17:00', energy: 170 },
  { time: '18:00', energy: 140 }
];

// Configuration
const API_BASE_URL = 'http://localhost:5001/api';
const RECEIVER_ADDRESSES = [
  '0x606aBa42A91bE87c061C20ba52b1C2a9ACe96096',
  '0x1e671B9F7F295B3EdCb03375F522F31CB9b83780',
  '0xE4BDA2cdD0BCAE978654D3d1dcefFe8F5B674f95',
  '0x1E5CF5f4f260EDffeBd6d933b7D4BCcC392EA29B',
  '0xa7f43130D7C983e3648Ec8b29920B9CDB66d085D',
  '0xC1Ce24b50C088848820638e03D7Cd196867508B8',
  '0x41080Dc0beA1811AeaD58A5C1AB48dB3ADA405FF',
  '0x79C4dB39F340938bB2Cc1e534FDA9Bfd28796322',
  '0xa45691373fEA0aF580BC26A0B0feEd2E3427E5C1'
];

// Components
const WalletQRCode = ({ address }) => (
  <div className="text-center">
    <QRCodeCanvas value={`ethereum:${address}`} />
    <p className="mt-2">Scan to connect your wallet</p>
  </div>
);

const EnergyChart = () => (
  <div className="w-full h-[300px]">
    <LineChart width={500} height={300} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="energy" stroke="#8884d8" />
    </LineChart>
  </div>
);

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/leaderboard`)
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((error) => console.error('Error fetching leaderboard:', error));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Energy Producers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((producer, index) => (
            <div key={producer._id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold">{index + 1}.</span>
                <span>{producer._id.slice(0, 6)}...{producer._id.slice(-4)}</span>
              </div>
              <span className="font-medium">{producer.totalEnergySold} kWh</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      onLogin(data.role);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consumer');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      onRegister();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full p-2 border rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="consumer">Consumer</option>
              <option value="producer">Producer</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Register
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

const EnergyListingForm = ({ onSubmit, loading }) => {
  const [listingData, setListingData] = useState({
    price: '',
    energyAmount: '',
    duration: '24'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(listingData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5" />
          List Energy for Sale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (ETH)</label>
            <input
              type="number"
              step="0.001"
              className="w-full p-2 border rounded"
              value={listingData.price}
              onChange={(e) => setListingData({ ...listingData, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Energy Amount (kWh)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={listingData.energyAmount}
              onChange={(e) => setListingData({ ...listingData, energyAmount: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration (hours)</label>
            <select
              className="w-full p-2 border rounded"
              value={listingData.duration}
              onChange={(e) => setListingData({ ...listingData, duration: e.target.value })}
            >
              <option value="24">24 hours</option>
              <option value="48">48 hours</option>
              <option value="72">72 hours</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'List Energy'}
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

const EnergyOfferCard = ({ offer, onPurchase, loading }) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{offer.price} ETH</h3>
            <p className="text-sm text-gray-600">{offer.energyAmount} kWh available</p>
          </div>
          <Battery className="h-6 w-6 text-green-500" />
        </div>
        <div className="space-y-2">
          <p className="text-sm">Producer: {offer.producer.slice(0, 6)}...{offer.producer.slice(-4)}</p>
          <p className="text-sm">Listed: {new Date(offer.timestamp).toLocaleDateString()}</p>
          <button
            onClick={() => onPurchase(offer)}
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Purchase Energy'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

const EnergyMarketplace = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [isProducer, setIsProducer] = useState(false);
  const [energyOffers, setEnergyOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchEnergyOffers();
  }, []);

  const fetchEnergyOffers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/energy-offers`);
      const data = await response.json();
      setEnergyOffers(data);
    } catch (err) {
      setError('Failed to fetch energy offers');
    }
  };

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleRegister = () => {
    alert('Registration successful! Please login.');
  };

  const initWeb3 = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this application');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Instance = new Web3(window.ethereum);
      const accounts = await web3Instance.eth.getAccounts();

      setWeb3(web3Instance);
      setAccount(accounts[0]);

      window.ethereum.on('accountsChanged', accounts => setAccount(accounts[0]));
      window.ethereum.on('chainChanged', () => window.location.reload());
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEnergyListing = async (listingData) => {
    setLoading(true);
    try {
      const priceInWei = web3.utils.toWei(listingData.price, 'ether');

      const response = await fetch(`${API_BASE_URL}/list-energy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: priceInWei,
          energyAmount: listingData.energyAmount,
          duration: listingData.duration,
          producer: account
        })
      });

      if (!response.ok) throw new Error('Failed to list energy');

      fetchEnergyOffers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnergyPurchase = async (offer) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      const tx = {
        from: account,
        to: RECEIVER_ADDRESSES[Math.floor(Math.random() * RECEIVER_ADDRESSES.length)],
        value: offer.priceInWei,
        gas: '21000'
      };

      await web3.eth.sendTransaction(tx);

      const response = await fetch(`${API_BASE_URL}/purchase-energy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: offer.offerId,
          amount: 1,
          buyer: account
        })
      });

      if (!response.ok) throw new Error('Purchase failed');

      fetchEnergyOffers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-6 w-full max-w-md px-4">
          <LoginForm onLogin={handleLogin} />
          <RegisterForm onRegister={handleRegister} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Sun className="h-8 w-8 text-yellow-500" />
              <span className="ml-2 text-xl font-bold">Energy Marketplace</span>
            </div>
            <div className="flex items-center space-x-4">
              {account ? (
                <>
                  <span className="text-sm text-gray-600">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                  <button
                    onClick={() => setIsProducer(!isProducer)}
                    className="text-sm bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
                  >
                    {isProducer ? 'Switch to Consumer' : 'Switch to Producer'}
                  </button>
                </>
              ) : (
                <button
                  onClick={initWeb3}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isProducer ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Producer Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <EnergyListingForm onSubmit={handleEnergyListing} loading={loading} />
                {account && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Your Wallet QR Code</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <WalletQRCode address={account} />
                    </CardContent>
                  </Card>
                )}
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Energy Production History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnergyChart />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Available Energy Offers</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {energyOffers.map((offer) => (
                    <EnergyOfferCard 
                      key={offer.offerId} 
                      offer={offer}
                      onPurchase={handleEnergyPurchase}
                      loading={loading}
                    />
                  ))}
                </div>
              </div>
              <div className="lg:col-span-1">
                <Leaderboard />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EnergyMarketplace;