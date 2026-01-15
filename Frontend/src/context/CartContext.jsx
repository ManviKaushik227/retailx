import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState({
    items: [],
    spent: 0,
    monthlyBudget: 2000,
    percentUsed: 0,
    remaining: 2000
  });

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id || user?._id || null;
  };

  /* =======================
     FETCH CART
     ======================= */
  const fetchCart = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/cart?userId=${userId}`);
      setCartData(res.data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  }, []);

  /* =======================
     UPDATE BUDGET
     ======================= */
  const updateBudget = async (newLimit) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await axios.post('http://localhost:5000/api/cart/budget', {
        userId,
        monthlyBudget: parseFloat(newLimit)
      });

      setCartData(res.data);

      Swal.fire({
        icon: "success",
        title: "Budget Updated",
        text: "Your monthly budget has been updated successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error("Budget update error:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Unable to update budget. Please try again.",
      });
    }
  };

  /* =======================
     ADD TO CART
     ======================= */
  const addToCart = async (product) => {
    const userId = getUserId();

    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add items to your cart.",
      });
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/cart/add', {
        userId,
        productId: product._id || product.id,
        name: product.name,
        price: product.price || product.finalPrice,
        imageURL: product.imageURL || product.image,
        brand: product.brand,
        category: product.category,
        quantity: 1
      });

      setCartData(res.data);

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: "The product has been added to your cart.",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Cannot Add Product",
        text: err.response?.data?.error || "Something went wrong. Please try again.",
      });
    }
  };

  /* =======================
     UPDATE QUANTITY
     ======================= */
  const updateQuantity = async (productId, newQuantity) => {
    const userId = getUserId();
    if (!userId || newQuantity < 1) return;

    try {
      const res = await axios.post('http://localhost:5000/api/cart/update', {
        userId,
        productId,
        quantity: newQuantity
      });

      setCartData(res.data);

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.error || "Unable to update product quantity.",
      });
    }
  };

  /* =======================
     REMOVE FROM CART
     ======================= */
  const removeFromCart = async (productId) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await axios.post('http://localhost:5000/api/cart/remove', {
        userId,
        productId
      });

      setCartData(res.data);

    } catch (err) {
      console.error("Remove error:", err);
      Swal.fire({
        icon: "error",
        title: "Removal Failed",
        text: "Unable to remove item from cart.",
      });
    }
  };

  /* =======================
     EFFECTS
     ======================= */
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const handleStorageChange = () => fetchCart();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{
      cartData,
      addToCart,
      fetchCart,
      updateQuantity,
      removeFromCart,
      updateBudget
    }}>
      {children}
    </CartContext.Provider>
  );
};
