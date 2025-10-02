import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, User, ShoppingCart } from 'lucide-react';

// Bug 1: Component with incorrect state initialization
const Counter = ({ initialCount = 0, label }) => {
  const [count, setCount] = useState(initialCount);
  
  // Bug: This effect runs on every render, causing performance issues
  useEffect(() => {
    console.log(`Counter "${label}" updated:`, count);
  });
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{label}</h3>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCount(count - 1)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -
        </button>
        <span className="text-2xl font-bold text-gray-800 min-w-[40px] text-center">
          {count}
        </span>
        <button
          onClick={() => setCount(count + 1)}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          +
        </button>
      </div>
    </div>
  );
};

// Bug 2: Missing key prop in list rendering
const UserList = ({ users }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <User size={20} />
        User List
      </h3>
      <div className="space-y-2">
        {users.map((user) => (
          // Bug: Missing key prop
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <p className="font-medium text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Bug 3: Props not being passed correctly
const ShoppingCartItem = ({ name, price, quantity }) => {
  // Bug: Incorrect calculation - should multiply price by quantity
  const total = price + quantity;
  
  return (
    <div className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
      <div>
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-sm text-gray-600">Quantity: {quantity}</p>
      </div>
      <p className="text-lg font-bold text-gray-800">${total.toFixed(2)}</p>
    </div>
  );
};

const ShoppingCart = ({ items }) => {
  // Bug: Incorrect total calculation
  const cartTotal = items.reduce((sum, item) => sum + item.price + item.quantity, 0);
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <ShoppingCart size={20} />
        Shopping Cart
      </h3>
      <div className="space-y-2 mb-4">
        {items.map((item, index) => (
          <ShoppingCartItem
            key={index}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
          />
        ))}
      </div>
      <div className="pt-3 border-t border-gray-300">
        <p className="text-xl font-bold text-gray-800 text-right">
          Total: ${cartTotal.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

// Bug 4: Component re-renders unnecessarily
const StatusIndicator = ({ status, message }) => {
  console.log('StatusIndicator rendered'); // This will show unnecessary renders
  
  return (
    <div className={`p-4 rounded-lg flex items-center gap-3 ${
      status === 'success' ? 'bg-green-100 border border-green-300' : 'bg-yellow-100 border border-yellow-300'
    }`}>
      {status === 'success' ? (
        <CheckCircle className="text-green-600" size={24} />
      ) : (
        <AlertCircle className="text-yellow-600" size={24} />
      )}
      <p className="text-gray-800">{message}</p>
    </div>
  );
};

// Main App Component
const App = () => {
  const [users] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' }
  ]);
  
  const [cartItems] = useState([
    { id: 1, name: 'Laptop', price: 999.99, quantity: 1 },
    { id: 2, name: 'Mouse', price: 29.99, quantity: 2 },
    { id: 3, name: 'Keyboard', price: 79.99, quantity: 1 }
  ]);
  
  const [refreshKey, setRefreshKey] = useState(0);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            React Debugging Demo
          </h1>
          <p className="text-gray-600 mb-4">
            This application contains several intentional bugs. Use React Developer Tools to identify and fix them!
          </p>
          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <RefreshCw size={18} />
            Force Re-render
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Counter label="Counter A" initialCount={0} />
          <Counter label="Counter B" initialCount={10} />
        </div>
        
        <div className="mb-6">
          <StatusIndicator 
            status="success" 
            message={`Application loaded successfully (Render: ${refreshKey})`} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserList users={users} />
          <ShoppingCart items={cartItems} />
        </div>
        
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Bugs to Find:</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">1.</span>
              <span>Counter components trigger useEffect on every render (performance issue)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">2.</span>
              <span>UserList is missing key props in mapped components</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">3.</span>
              <span>ShoppingCartItem and ShoppingCart have incorrect price calculations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">4.</span>
              <span>StatusIndicator re-renders unnecessarily when counters update</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
