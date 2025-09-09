import React from 'react';
import { ShoppingBag, Star, Heart, ExternalLink, Truck, Shield, RotateCcw } from 'lucide-react';

const Store = () => {
  const products = [
    {
      id: 1,
      name: "Johan the Historian Plushie",
      price: 29.99,
      originalPrice: 39.99,
      image: "/images/johan-plushie.jpg",
      description: "Meet Johan, your friendly history companion! This soft and cuddly plushie is perfect for history enthusiasts of all ages.",
      features: ["Soft premium materials", "12 inches tall", "Machine washable", "Official Historia merchandise"],
      rating: 4.9,
      reviews: 127,
      inStock: true,
      badge: "BESTSELLER"
    },
    {
      id: 2,
      name: "Johan Mini Keychain",
      price: 8.99,
      image: "/images/johan-keychain.jpg",
      description: "Take Johan with you everywhere! This adorable mini keychain features our beloved historian mascot.",
      features: ["Durable metal construction", "2 inches tall", "Keyring included", "Perfect gift"],
      rating: 4.7,
      reviews: 89,
      inStock: true,
      badge: "NEW"
    },
    {
      id: 3,
      name: "Historia Study Set",
      price: 49.99,
      image: "/images/study-set.jpg",
      description: "Complete study companion set featuring Johan and essential history study materials.",
      features: ["Johan plushie included", "History timeline poster", "Study stickers pack", "Exclusive notebook"],
      rating: 4.8,
      reviews: 45,
      inStock: false,
      badge: "LIMITED"
    }
  ];

  const handlePurchase = (productId: number) => {
    // In a real app, this would redirect to a payment processor
    alert(`Redirecting to purchase ${products.find(p => p.id === productId)?.name}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <ShoppingBag className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-800">Historia Store</h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Bring your favorite history companion home! Shop our exclusive Johan merchandise and study materials.
            </p>
          </div>

          {/* Features Banner */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Truck className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $25</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Quality Guarantee</h3>
                <p className="text-sm text-gray-600">100% satisfaction or money back</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Easy Returns</h3>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {product.badge}
                    </div>
                  )}
                  <div className="text-6xl">🧸</div>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-white text-black px-4 py-2 rounded-lg font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Product Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-purple-600">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handlePurchase(product.id)}
                      disabled={!product.inStock}
                      className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                        product.inStock
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Love Learning History?</h2>
              <p className="text-lg mb-6 opacity-90">
                Get your Johan plushie and make history learning even more fun!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  <ExternalLink className="w-4 h-4 inline mr-2" />
                  Visit Full Store
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                  <Heart className="w-4 h-4 inline mr-2" />
                  Follow for Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
