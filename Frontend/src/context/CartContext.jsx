import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initial state ko backend se sync rakha hai (Budget ab null ho sakta hai)
  const [cartData, setCartData] = useState({
    items: [],
    spent: 0,
    monthlyBudget: null, // Default null, user set karega tabhi dikhega
    percentUsed: 0,
    remaining: null
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
      // Backend se items, spent, monthlyBudget, percentUsed, remaining sab ek saath aayega
      setCartData(res.data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  }, []);

  /* =======================
      UPDATE BUDGET (Modified for Optional Budget)
     ======================= */
  const updateBudget = async (newLimit) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      // Agar newLimit null hai (yani user budget hata raha hai), toh null bhejo
      const budgetValue = newLimit === null ? null : parseFloat(newLimit);
      
      const res = await axios.post('http://localhost:5000/api/cart/budget', {
        userId,
        monthlyBudget: budgetValue
      });

      setCartData(res.data);

      if (budgetValue !== null) {
        Swal.fire({
          icon: "success",
          title: "Budget Updated",
          text: "Your monthly budget has been updated successfully.",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "Budget Removed",
          text: "Tracking disabled.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

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
      ADD TO CART (Kept original logic)
     ======================= */
  const addToCart = async (product) => {
    const userId = getUserId();

    if (!userId) {
      Swal.fire({ icon: "warning", title: "Login Required", text: "Please login to add items." });
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
      Swal.fire({ icon: "success", title: "Added to Cart", timer: 1500, showConfirmButton: false });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Cannot Add Product",
        text: err.response?.data?.error || "Budget might be exceeded.",
      });
    }
  };

  /* =======================
      UPDATE QUANTITY (Sync with Backend Model)
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
      Swal.fire({ icon: "error", title: "Update Failed", text: "Unable to update quantity." });
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
    }
  };

  useEffect(() => {
    fetchCart();
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