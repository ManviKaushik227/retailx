

















// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { Star, ShoppingCart, Zap, Plus, Check } from 'lucide-react';
// import Navbar from "../Components/Navbar";
// import Footer from "../Components/Footer";
// import { CartContext } from "../context/CartContext"; 

// const ProductPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { cartData, addToCart } = useContext(CartContext);
  
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [frequentlyBought, setFrequentlyBought] = useState([]);
//   const [similarProducts, setSimilarProducts] = useState([]);
//   const [selectedAddons, setSelectedAddons] = useState([]);

//   // Check if product is in cart (Handling both id and _id)
//   const isInCart = cartData?.items?.some(item => (item.productId === id || item._id === id));

//   useEffect(() => {
//     const fetchProductData = async () => {
//       if (!id) return;
//       setLoading(true);
//       try {
//         // 1. Fetch Main Product
//         const response = await fetch(`http://localhost:5000/api/products/${id}`);
        
//         // VALIDATION: Agar server 404 ya HTML bhej raha hai
//         if (!response.ok) throw new Error("Product not found");
//         const contentType = response.headers.get("content-type");
//         if (!contentType || !contentType.includes("application/json")) {
//             throw new Error("Server didn't return JSON. Check your backend URL.");
//         }

//         const data = await response.json();
//         setCurrentProduct(data);
//         window.scrollTo(0, 0);

//         // 2. Fetch Addons (Accessories)
//         const resAddons = await fetch(`http://localhost:5000/api/products?category=accessories&limit=5`);
//         if (resAddons.ok) {
//           const addonsData = await resAddons.json();
//           // Filter out current product
//           setFrequentlyBought(addonsData.filter(p => (p._id !== id && p.id !== id)).slice(0, 3));
//         }

//         // 3. Fetch Similar Products
//         const resSimilar = await fetch(`http://localhost:5000/api/products?category=${data.category}&limit=10`);
//         if (resSimilar.ok) {
//           const similarData = await resSimilar.json();
//           setSimilarProducts(similarData.filter(p => (p._id !== id && p.id !== id)));
//         }

//       } catch (error) {
//         console.error("Fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProductData();
//   }, [id]);

//   const toggleAddon = (prod) => {
//     const addonId = prod._id || prod.id;
//     if (selectedAddons.find(a => (a._id === addonId || a.id === addonId))) {
//       setSelectedAddons(selectedAddons.filter(a => (a._id !== addonId && a.id !== addonId)));
//     } else {
//       setSelectedAddons([...selectedAddons, prod]);
//     }
//   };

//   const handleFullPurchase = async () => {
//     // Add primary product if not in cart
//     if (!isInCart && currentProduct) {
//         await addToCart({
//             productId: currentProduct._id || currentProduct.id,
//             name: currentProduct.name,
//             price: currentProduct.finalPrice,
//             image: currentProduct.imageURL,
//             brand: currentProduct.brand
//         });
//     }
    
//     // Add selected addons
//     for (const addon of selectedAddons) {
//         await addToCart({
//             productId: addon._id || addon.id,
//             name: addon.name,
//             price: addon.finalPrice,
//             image: addon.imageURL,
//             brand: addon.brand
//         });
//     }
//     navigate('/cart');
//   };

//   if (loading) return (
//     <div className="h-screen flex flex-col items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
//         <p className="font-bold text-gray-600">Loading Product...</p>
//     </div>
//   );

//   if (!currentProduct) return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

//   return (
//     <div className="bg-[#f1f3f6] min-h-screen font-sans">
//       <Navbar />

//       <main className="max-w-[1280px] mx-auto py-2 px-2 mt-14">
//         <div className="flex flex-col md:flex-row gap-4 items-start">
          
//           {/* LEFT: IMAGE SECTION */}
//           <div className="md:w-[40%] md:sticky md:top-[70px] w-full">
//             <div className="bg-white p-4 border rounded-sm shadow-sm">
//               <div className="border p-2 mb-4 h-[450px] flex items-center justify-center bg-white">
//                 <img 
//                   src={currentProduct.imageURL || "https://placehold.co/400x400?text=No+Image"} 
//                   alt={currentProduct.name} 
//                   className="max-h-full max-w-full object-contain"
//                   onError={(e) => { e.target.src = "https://placehold.co/400x400?text=Image+Error"; }}
//                 />
//               </div>
//               <div className="flex gap-2">
//                 <button 
//                   onClick={async () => { 
//                     if(isInCart) navigate('/cart'); 
//                     else await addToCart({
//                         productId: currentProduct._id || currentProduct.id,
//                         name: currentProduct.name,
//                         price: currentProduct.finalPrice,
//                         image: currentProduct.imageURL,
//                         brand: currentProduct.brand
//                     }); 
//                   }} 
//                   className={`flex-1 ${isInCart ? 'bg-blue-600' : 'bg-[#ff9f00]'} text-white py-4 rounded-sm font-bold text-lg uppercase shadow-sm transition-colors`}
//                 >
//                   <ShoppingCart size={20} className="inline mr-2" />
//                   {isInCart ? "Go to Cart" : "Add to Cart"}
//                 </button>
//                 <button className="flex-1 bg-[#fb641b] text-white py-4 rounded-sm font-bold text-lg uppercase shadow-sm">
//                   <Zap size={20} className="inline mr-2 fill-current" /> Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: CONTENT SECTION */}
//           <div className="md:w-[60%] w-full space-y-4">
//             <div className="bg-white p-6 border rounded-sm shadow-sm">
//               <nav className="text-xs text-gray-500 mb-2 uppercase">Home &gt; {currentProduct.category} &gt; {currentProduct.brand}</nav>
//               <h1 className="text-xl font-medium text-gray-900 leading-tight">{currentProduct.name}</h1>
              
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center">
//                   {currentProduct.rating || "4.2"} <Star size={10} className="ml-0.5 fill-current" />
//                 </span>
//                 <span className="text-gray-500 text-sm font-bold">{currentProduct.reviewsCount || "1,200"} Ratings</span>
//               </div>

//               <div className="mt-4 flex items-baseline gap-3">
//                 <span className="text-3xl font-bold">₹{currentProduct.finalPrice?.toLocaleString()}</span>
//                 {currentProduct.price > currentProduct.finalPrice && (
//                   <>
//                     <span className="text-gray-500 line-through text-lg">₹{currentProduct.price?.toLocaleString()}</span>
//                     <span className="text-green-600 font-bold text-sm">{currentProduct.discount}% off</span>
//                   </>
//                 )}
//               </div>

//               {/* Frequently Bought Together */}
//               {frequentlyBought.length > 0 && (
//                 <div className="mt-8 border rounded-sm p-5 bg-[#f5faff] border-blue-100">
//                     <h3 className="text-base font-bold mb-4 text-gray-800">Frequently Bought Together</h3>
//                     <div className="flex items-center gap-3 overflow-x-auto pb-2">
//                         <div className="flex-shrink-0 text-center">
//                             <div className="w-20 h-20 bg-white p-1 border rounded-sm">
//                                 <img src={currentProduct.imageURL} className="h-full w-full object-contain mx-auto" alt="main" />
//                             </div>
//                             <p className="text-[10px] mt-1 font-bold text-blue-600 uppercase">This Item</p>
//                         </div>
                        
//                         {frequentlyBought.map((item) => (
//                             <React.Fragment key={item._id || item.id}>
//                                 <Plus size={16} className="text-gray-400 flex-shrink-0" />
//                                 <div className="flex-shrink-0 w-24 text-center cursor-pointer group" onClick={() => toggleAddon(item)}>
//                                     <div className="relative w-20 h-20 bg-white p-1 border rounded-sm mx-auto">
//                                         <img src={item.imageURL} className="h-full w-full object-contain mx-auto" alt="addon" />
//                                         <div className={`absolute -top-2 -right-2 rounded-full border shadow-sm p-0.5 ${selectedAddons.some(a => (a._id === item._id || a.id === item.id)) ? 'bg-blue-600 text-white' : 'bg-white text-gray-300'}`}>
//                                             <Check size={12} />
//                                         </div>
//                                     </div>
//                                     <p className="text-[10px] mt-1 truncate font-medium group-hover:text-blue-600 transition">{item.name}</p>
//                                     <p className="text-xs font-bold">₹{item.finalPrice}</p>
//                                 </div>
//                             </React.Fragment>
//                         ))}
//                     </div>
//                     <div className="mt-4 pt-4 border-t border-blue-100 flex justify-between items-center">
//                         <p className="text-sm font-medium">Total Price: <span className="text-lg font-bold">₹{(currentProduct.finalPrice + selectedAddons.reduce((a,b)=>a+b.finalPrice, 0)).toLocaleString()}</span></p>
//                         <button onClick={handleFullPurchase} className="bg-[#fb641b] text-white px-5 py-2 rounded-sm font-bold text-xs uppercase shadow-md">Add {selectedAddons.length + (isInCart ? 0 : 1)} items to cart</button>
//                     </div>
//                 </div>
//               )}

//               {/* Highlights */}
//               <div className="mt-8">
//                 <h3 className="font-bold border-b pb-2 mb-3">Product Highlights</h3>
//                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-gray-700">
//                   {currentProduct.highlights?.length > 0 ? 
//                     currentProduct.highlights.map((h, i) => <li key={i} className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></div> {h}</li>) 
//                     : <li className="italic text-gray-400">No highlights available</li>
//                   }
//                 </ul>
//               </div>

//               {/* Specifications */}
//               <div className="mt-8 border-t pt-6">
//                 <h3 className="font-bold mb-4">Specifications</h3>
//                 <div className="border rounded-sm overflow-hidden shadow-sm">
//                   {currentProduct.specs && Object.entries(currentProduct.specs).map(([k, v], i) => (
//                     <div key={k} className={`flex text-sm p-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
//                       <span className="w-1/3 text-gray-500 font-medium">{k}</span>
//                       <span className="w-2/3 font-medium text-gray-800">{v}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default ProductPage;







import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  Plus,
  Check,
  Heart,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Zap
} from "lucide-react";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { CartContext } from "../context/CartContext";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const { cartData, addToCart } = useContext(CartContext);

  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const [isDescOpen, setIsDescOpen] = useState(false);
  const [isHighlightsOpen, setIsHighlightsOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isInCart = cartData?.items?.some(
    (item) => item.productId === id || item._id === id
  );

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setCurrentProduct(data);
        window.scrollTo(0, 0);

        const simRes = await fetch(
          `http://localhost:5000/api/products?category=${data.category}&limit=18`
        );
        if (simRes.ok) {
          const simData = await simRes.json();
          const filtered = simData.filter(
            (p) => (p._id || p.id) !== id
          );
          setSimilarProducts(filtered.slice(0, 12));
          setFrequentlyBought(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  /* ---------------- HELPERS ---------------- */
  const toggleAddon = (prod) => {
    const pid = prod._id || prod.id;
    setSelectedAddons((prev) =>
      prev.some((a) => (a._id || a.id) === pid)
        ? prev.filter((a) => (a._id || a.id) !== pid)
        : [...prev, prod]
    );
  };

  const handleBulkAdd = async () => {
    if (!isInCart && currentProduct) {
      await addToCart({
        productId: currentProduct._id || currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.finalPrice,
        image: currentProduct.imageURL,
        brand: currentProduct.brand,
      });
    }

    for (const addon of selectedAddons) {
      await addToCart({
        productId: addon._id || addon.id,
        name: addon.name,
        price: addon.finalPrice,
        image: addon.imageURL,
        brand: addon.brand,
      });
    }
    navigate("/cart");
  };

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    scrollRef.current.scrollTo({
      left: dir === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth,
      behavior: "smooth",
    });
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-bold text-[#2874f0] text-2xl">
        Loading...
      </div>
    );

  if (!currentProduct)
    return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

  const discount =
    currentProduct.price && currentProduct.finalPrice
      ? Math.round(
          ((currentProduct.price - currentProduct.finalPrice) /
            currentProduct.price) *
            100
        )
      : 0;

  /* ======================= UI ======================= */
  return (
    <div className="bg-[#f1f3f6] min-h-screen font-sans">
      <Navbar />

      <main className="max-w-[1280px] mx-auto py-4 px-2 mt-14">
        <div className="flex flex-col md:flex-row gap-4 items-start">

          {/* LEFT */}
          <div className="md:w-[40%] md:sticky md:top-[75px] w-full">
            <div className="bg-white p-4 border rounded-sm shadow-sm relative">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute right-5 top-5 p-2 bg-white rounded-full shadow"
              >
                <Heart
                  size={20}
                  className={
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }
                />
              </button>

              <div className="h-[450px] border flex items-center justify-center mb-4">
                <img
                  src={currentProduct.imageURL}
                  alt={currentProduct.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    isInCart
                      ? navigate("/cart")
                      : addToCart({
                          productId: currentProduct._id || currentProduct.id,
                          name: currentProduct.name,
                          price: currentProduct.finalPrice,
                          image: currentProduct.imageURL,
                          brand: currentProduct.brand,
                        })
                  }
                  className="flex-1 bg-[#ff9f00] text-white py-4 font-bold uppercase flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  {isInCart ? "Go to Cart" : "Add to Cart"}
                </button>
                <button className="flex-1 bg-[#fb641b] text-white py-4 font-bold uppercase flex items-center justify-center gap-2">
                  <Zap size={18} /> Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:w-[60%] w-full space-y-4">
            <div className="bg-white p-6 border rounded-sm shadow-sm">
              <h1 className="text-xl font-bold">{currentProduct.name}</h1>

              <div className="flex items-center gap-2 mt-2">
                <span className="bg-green-700 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                  {currentProduct.rating || 4.2}
                  <Star size={12} className="fill-current" />
                </span>
                <span className="text-gray-500 text-sm font-bold">
                  {currentProduct.reviewsCount || 1200} Ratings
                </span>
              </div>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-bold">
                  ₹{currentProduct.finalPrice?.toLocaleString()}
                </span>
                <span className="line-through text-gray-500">
                  ₹{currentProduct.price?.toLocaleString()}
                </span>
                <span className="text-green-600 font-bold">{discount}% off</span>
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-xs uppercase text-gray-400 font-bold mb-2">
                  Description
                </h3>
                <p
                  className={`text-sm ${
                    !isDescOpen ? "line-clamp-3" : ""
                  }`}
                >
                  {currentProduct.description}
                </p>
                <button
                  onClick={() => setIsDescOpen(!isDescOpen)}
                  className="text-blue-600 text-sm font-bold mt-1"
                >
                  {isDescOpen ? "Read Less" : "Read More"}
                </button>
              </div>

              {/* HIGHLIGHTS */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-xs uppercase text-gray-400 font-bold mb-3">
                  Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentProduct.highlights?.map((h, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-green-600" />
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* FREQUENTLY BOUGHT */}
              {frequentlyBought.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="font-bold mb-4">Frequently Bought Together</h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={currentProduct.imageURL}
                      className="w-20 h-20 object-contain border p-2"
                    />
                    {frequentlyBought.map((item) => {
                      const active = selectedAddons.some(
                        (a) => (a._id || a.id) === (item._id || item.id)
                      );
                      return (
                        <div
                          key={item._id || item.id}
                          onClick={() => toggleAddon(item)}
                          className={`relative w-20 h-20 border p-2 cursor-pointer ${
                            active ? "border-blue-600 bg-blue-50" : ""
                          }`}
                        >
                          <img
                            src={item.imageURL}
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1">
                            <Check size={12} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleBulkAdd}
                    className="mt-4 bg-[#fb641b] text-white px-6 py-2 font-bold"
                  >
                    ADD {selectedAddons.length + (isInCart ? 0 : 1)} ITEMS
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIMILAR PRODUCTS */}
        <div className="bg-white mt-6 border rounded-sm shadow-sm relative group">
          <h3 className="px-6 py-4 font-bold">Similar Products</h3>

          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 hidden group-hover:flex bg-white p-3 shadow"
          >
            <ChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 p-4 scroll-smooth"
          >
            {similarProducts.map((p) => (
              <Link
                key={p._id || p.id}
                to={`/product/${p._id || p.id}`}
                className="min-w-[220px] p-4 border hover:shadow-lg"
              >
                <img
                  src={p.imageURL}
                  className="h-40 mx-auto object-contain"
                />
                <p className="text-sm font-bold mt-2 truncate">{p.name}</p>
                <p className="text-green-600 font-bold">
                  ₹{p.finalPrice?.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:flex bg-white p-3 shadow"
          >
            <ChevronRight />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
