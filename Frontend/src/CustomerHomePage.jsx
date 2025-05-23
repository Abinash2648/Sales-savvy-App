import React, { useState, useEffect } from 'react';
import { CategoryNavigation } from './CategoryNavigation';
import { ProductList } from './ProductList';
import { Footer } from './Footer';
import { Header } from './Header';
import './assets/style.css';

export default function CustomerHomePage() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState('');
  const [cartError, setCartError] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  

  // Fetch cart count when username is available
  useEffect(() => {
    if (username && username !== 'Guest') {
      fetchCartCount();
    }
  }, [username]);
  

// Fetch products on initial load
useEffect(() => {
  fetchProducts();
}, []);



  const fetchProducts = async (category = '') => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch(
        `http://localhost:9090/api/products${category ? `?category=${category}` : '?category=Shirts'}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (data) {
        console.log('productsdata' ,data);
        
        if (!username) {
          setUsername(data.user?.name || 'Guest');
        }
        
        setProducts(data.products || []);


      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchCartCount = async () => {
    setIsCartLoading(true);
    try {
      const response = await fetch(
        `http://localhost:9090/api/cart/items/count?username=${username}`,
        { credentials: 'include' }
      );
      const count = await response.json();
      setCartCount(count);
      setCartError(false);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartError(true);
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    fetchProducts(category);
  };

  const handleAddToCart = async (productId) => {
    if (!username) {
      console.error('Username is required to add items to the cart');
      return;
    }
    try {
      const response = await fetch('http://localhost:9090/api/cart/add', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ username, productId }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        fetchCartCount();
      } else {
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };








  return (
    <div className="customer-homepage">
      <Header
        cartCount={isCartLoading ? '...' : cartError ? 'Error' : cartCount}
        username={username}
      />
      <nav className="navigation">
        <CategoryNavigation onCategoryClick={handleCategoryClick} />
      </nav>
      <main className="main-content">
        {isLoadingProducts ? (
          <p className="loading-text">Loading products...</p>
        ) : (
          <ProductList products={products} onAddToCart={handleAddToCart} />
        )}
      </main>
      <Footer />
    </div>
  );
}
