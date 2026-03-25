
// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   Star,
//   Plus,
//   Check,
//   Heart,
//   ChevronDown,
//   ChevronUp,
//   CheckCircle2,
//   ChevronLeft,
//   ChevronRight,
//   ShoppingCart,
//   Zap
// } from "lucide-react";

// import Navbar from "../Components/Navbar";
// import Footer from "../Components/Footer";
// import { CartContext } from "../context/CartContext";

// const ProductPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const scrollRef = useRef(null);

//   const { cartData, addToCart } = useContext(CartContext);

//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [similarProducts, setSimilarProducts] = useState([]);
//   const [frequentlyBought, setFrequentlyBought] = useState([]);
//   const [selectedAddons, setSelectedAddons] = useState([]);

//   const [isDescOpen, setIsDescOpen] = useState(false);
//   const [isHighlightsOpen, setIsHighlightsOpen] = useState(false);
//   const [isSpecsOpen, setIsSpecsOpen] = useState(false);
//   const [isWishlisted, setIsWishlisted] = useState(false);

//   const isInCart = cartData?.items?.some(
//     (item) => item.productId === id || item._id === id
//   );

//   /* ---------------- FETCH DATA ---------------- */
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`http://localhost:5000/api/products/${id}`);
//         if (!res.ok) throw new Error("Product not found");
//         const data = await res.json();
//         setCurrentProduct(data);
//         window.scrollTo(0, 0);

//         const simRes = await fetch(
//           `http://localhost:5000/api/products?category=${data.category}&limit=18`
//         );
//         if (simRes.ok) {
//           const simData = await simRes.json();
//           const filtered = simData.filter(
//             (p) => (p._id || p.id) !== id
//           );
//           setSimilarProducts(filtered.slice(0, 12));
//           setFrequentlyBought(filtered.slice(0, 3));
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   /* ---------------- HELPERS ---------------- */
//   const toggleAddon = (prod) => {
//     const pid = prod._id || prod.id;
//     setSelectedAddons((prev) =>
//       prev.some((a) => (a._id || a.id) === pid)
//         ? prev.filter((a) => (a._id || a.id) !== pid)
//         : [...prev, prod]
//     );
//   };

//   const handleBulkAdd = async () => {
//     if (!isInCart && currentProduct) {
//       await addToCart({
//         productId: currentProduct._id || currentProduct.id,
//         name: currentProduct.name,
//         price: currentProduct.finalPrice,
//         image: currentProduct.imageURL,
//         brand: currentProduct.brand,
//       });
//     }

//     for (const addon of selectedAddons) {
//       await addToCart({
//         productId: addon._id || addon.id,
//         name: addon.name,
//         price: addon.finalPrice,
//         image: addon.imageURL,
//         brand: addon.brand,
//       });
//     }
//     navigate("/cart");
//   };

//   const scroll = (dir) => {
//     if (!scrollRef.current) return;
//     const { scrollLeft, clientWidth } = scrollRef.current;
//     scrollRef.current.scrollTo({
//       left: dir === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth,
//       behavior: "smooth",
//     });
//   };

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center font-bold text-[#2874f0] text-2xl">
//         Loading...
//       </div>
//     );

//   if (!currentProduct)
//     return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

//   const discount =
//     currentProduct.price && currentProduct.finalPrice
//       ? Math.round(
//           ((currentProduct.price - currentProduct.finalPrice) /
//             currentProduct.price) *
//             100
//         )
//       : 0;

//   /* ======================= UI ======================= */
//   return (
//     <div className="bg-[#f1f3f6] min-h-screen font-sans">
//       <Navbar />

//       <main className="max-w-[1280px] mx-auto py-4 px-2 mt-14">
//         <div className="flex flex-col md:flex-row gap-4 items-start">

//           {/* LEFT */}
//           <div className="md:w-[40%] md:sticky md:top-[75px] w-full">
//             <div className="bg-white p-4 border rounded-sm shadow-sm relative">
//               <button
//                 onClick={() => setIsWishlisted(!isWishlisted)}
//                 className="absolute right-5 top-5 p-2 bg-white rounded-full shadow"
//               >
//                 <Heart
//                   size={20}
//                   className={
//                     isWishlisted
//                       ? "fill-red-500 text-red-500"
//                       : "text-gray-400"
//                   }
//                 />
//               </button>

//               <div className="h-[450px] border flex items-center justify-center mb-4">
//                 <img
//                   src={currentProduct.imageURL}
//                   alt={currentProduct.name}
//                   className="max-h-full max-w-full object-contain"
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <button
//                   onClick={() =>
//                     isInCart
//                       ? navigate("/cart")
//                       : addToCart({
//                           productId: currentProduct._id || currentProduct.id,
//                           name: currentProduct.name,
//                           price: currentProduct.finalPrice,
//                           image: currentProduct.imageURL,
//                           brand: currentProduct.brand,
//                         })
//                   }
//                   className="flex-1 bg-[#ff9f00] text-white py-4 font-bold uppercase flex items-center justify-center gap-2"
//                 >
//                   <ShoppingCart size={18} />
//                   {isInCart ? "Go to Cart" : "Add to Cart"}
//                 </button>
//                 <button className="flex-1 bg-[#fb641b] text-white py-4 font-bold uppercase flex items-center justify-center gap-2">
//                   <Zap size={18} /> Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="md:w-[60%] w-full space-y-4">
//             <div className="bg-white p-6 border rounded-sm shadow-sm">
//               <h1 className="text-xl font-bold">{currentProduct.name}</h1>

//               <div className="flex items-center gap-2 mt-2">
//                 <span className="bg-green-700 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
//                   {currentProduct.rating || 4.2}
//                   <Star size={12} className="fill-current" />
//                 </span>
//                 <span className="text-gray-500 text-sm font-bold">
//                   {currentProduct.reviewsCount || 1200} Ratings
//                 </span>
//               </div>

//               <div className="flex items-baseline gap-3 mt-4">
//                 <span className="text-3xl font-bold">
//                   ₹{currentProduct.finalPrice?.toLocaleString()}
//                 </span>
//                 <span className="line-through text-gray-500">
//                   ₹{currentProduct.price?.toLocaleString()}
//                 </span>
//                 <span className="text-green-600 font-bold">{discount}% off</span>
//               </div>

//               {/* DESCRIPTION */}
//               <div className="mt-6 border-t pt-4">
//                 <h3 className="text-xs uppercase text-gray-400 font-bold mb-2">
//                   Description
//                 </h3>
//                 <p
//                   className={`text-sm ${
//                     !isDescOpen ? "line-clamp-3" : ""
//                   }`}
//                 >
//                   {currentProduct.description}
//                 </p>
//                 <button
//                   onClick={() => setIsDescOpen(!isDescOpen)}
//                   className="text-blue-600 text-sm font-bold mt-1"
//                 >
//                   {isDescOpen ? "Read Less" : "Read More"}
//                 </button>
//               </div>

//               {/* HIGHLIGHTS */}
//               <div className="mt-6 border-t pt-4">
//                 <h3 className="text-xs uppercase text-gray-400 font-bold mb-3">
//                   Highlights
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {currentProduct.highlights?.map((h, i) => (
//                     <div key={i} className="flex gap-2 text-sm">
//                       <CheckCircle2 size={16} className="text-green-600" />
//                       {h}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* FREQUENTLY BOUGHT */}
//               {frequentlyBought.length > 0 && (
//                 <div className="mt-8 border-t pt-6">
//                   <h3 className="font-bold mb-4">Frequently Bought Together</h3>
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={currentProduct.imageURL}
//                       className="w-20 h-20 object-contain border p-2"
//                     />
//                     {frequentlyBought.map((item) => {
//                       const active = selectedAddons.some(
//                         (a) => (a._id || a.id) === (item._id || item.id)
//                       );
//                       return (
//                         <div
//                           key={item._id || item.id}
//                           onClick={() => toggleAddon(item)}
//                           className={`relative w-20 h-20 border p-2 cursor-pointer ${
//                             active ? "border-blue-600 bg-blue-50" : ""
//                           }`}
//                         >
//                           <img
//                             src={item.imageURL}
//                             className="w-full h-full object-contain"
//                           />
//                           <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1">
//                             <Check size={12} />
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   <button
//                     onClick={handleBulkAdd}
//                     className="mt-4 bg-[#fb641b] text-white px-6 py-2 font-bold"
//                   >
//                     ADD {selectedAddons.length + (isInCart ? 0 : 1)} ITEMS
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* SIMILAR PRODUCTS */}
//         <div className="bg-white mt-6 border rounded-sm shadow-sm relative group">
//           <h3 className="px-6 py-4 font-bold">Similar Products</h3>

//           <button
//             onClick={() => scroll("left")}
//             className="absolute left-0 top-1/2 -translate-y-1/2 hidden group-hover:flex bg-white p-3 shadow"
//           >
//             <ChevronLeft />
//           </button>

//           <div
//             ref={scrollRef}
//             className="flex overflow-x-auto gap-4 p-4 scroll-smooth"
//           >
//             {similarProducts.map((p) => (
//               <Link
//                 key={p._id || p.id}
//                 to={`/product/${p._id || p.id}`}
//                 className="min-w-[220px] p-4 border hover:shadow-lg"
//               >
//                 <img
//                   src={p.imageURL}
//                   className="h-40 mx-auto object-contain"
//                 />
//                 <p className="text-sm font-bold mt-2 truncate">{p.name}</p>
//                 <p className="text-green-600 font-bold">
//                   ₹{p.finalPrice?.toLocaleString()}
//                 </p>
//               </Link>
//             ))}
//           </div>

//           <button
//             onClick={() => scroll("right")}
//             className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:flex bg-white p-3 shadow"
//           >
//             <ChevronRight />
//           </button>
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
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw
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
  const [isFavorite, setIsFavorite] = useState(false);

  const [activeTab, setActiveTab] = useState("description");

  const isInCart = cartData?.items?.some(
    (item) => item.productId === id || item._id === id
  );

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setCurrentProduct(data);
        window.scrollTo(0, 0);

        const simRes = await fetch(
          `http://localhost:5000/api/products?category=${data.category}&limit=18`
        );
        const simData = await simRes.json();

        const filtered = simData.filter((p) => (p._id || p.id) !== id);
        setSimilarProducts(filtered.slice(0, 12));
        setFrequentlyBought(filtered.slice(0, 3));
      } catch (err) {
        console.log(err);
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

  const handleBundleBuy = async () => {
    if (!isInCart && currentProduct) {
      await addToCart({
        productId: currentProduct._id || currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.finalPrice,
        image: currentProduct.imageURL,
      });
    }
    for (const addon of selectedAddons) {
      await addToCart({
        productId: addon._id || addon.id,
        name: addon.name,
        price: addon.finalPrice,
        image: addon.imageURL,
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
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <div className="w-12 h-12 border-[3px] border-gray-100 border-t-black rounded-full animate-spin"></div>
        <p className="text-black text-[10px] font-bold uppercase tracking-[0.4em]">
          Initializing Studio
        </p>
      </div>
    );

  if (!currentProduct)
    return (
      <div className="h-screen flex items-center justify-center">
        Product Not Found
      </div>
    );

  /* ======================= UI ======================= */

  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-32 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-12">
          <Link to="/" className="hover:text-black transition">
            Studio
          </Link>
          <span className="w-1 h-1 rounded-full bg-gray-200"></span>
          <span>{currentProduct?.category}</span>
          <span className="w-1 h-1 rounded-full bg-gray-200"></span>
          <span className="text-black">{currentProduct?.brand}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-start">
          {/* LEFT IMAGE */}
          <div className="w-full lg:w-[55%] space-y-6">
            <div className="aspect-[4/5] bg-[#F7F7F7] rounded-sm flex items-center justify-center p-12 relative overflow-hidden group">
              <img
                src={currentProduct?.imageURL}
                alt={currentProduct?.name}
                className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
              />

              {/* WISHLIST */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all"
              >
                <Heart
                  size={20}
                  strokeWidth={isFavorite ? 0 : 1.5}
                  fill={isFavorite ? "red" : "none"}
                  className={isFavorite ? "text-red-500" : "text-black"}
                />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-32 space-y-8">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
                {currentProduct?.brand}
              </p>

              <h1 className="text-4xl font-medium leading-[1.1] mt-2">
                {currentProduct?.name}
              </h1>

              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-1 text-sm font-bold">
                  <Star size={14} className="fill-black" />
                  <span>{currentProduct?.rating || 4.2}</span>
                  <span className="text-gray-400 ml-1">
                    ({currentProduct?.reviewsCount || 1200})
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-200"></div>
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                  In Stock & Ready to Ship
                </p>
              </div>
            </div>

            {/* PRICE */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-light text-black">
                ₹{currentProduct?.finalPrice?.toLocaleString()}
              </span>
              {currentProduct?.price >
                currentProduct?.finalPrice && (
                <span className="text-gray-400 line-through text-lg">
                  ₹{currentProduct?.price?.toLocaleString()}
                </span>
              )}
            </div>

            {/* BUTTONS */}
            <div className="space-y-3 pt-6">
              <button
                onClick={() =>
                  isInCart
                    ? navigate("/cart")
                    : addToCart({
                        productId: currentProduct._id || currentProduct.id,
                        name: currentProduct.name,
                        price: currentProduct.finalPrice,
                        image: currentProduct.imageURL,
                      })
                }
                className={`w-full py-5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 ${
                  isInCart
                    ? "bg-gray-100 text-black border border-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isInCart ? (
                  <>
                    <Check size={16} /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Bag
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] border border-black hover:bg-black hover:text-white"
              >
                Direct Checkout
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 py-8 border-y border-gray-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={18} strokeWidth={1} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 italic">
                  Free Global Shipping
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck size={18} strokeWidth={1} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 italic">
                  2 Year Warranty
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw size={18} strokeWidth={1} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 italic">
                  30 Day Returns
                </span>
              </div>
            </div>

            {/* BUNDLE SYSTEM */}
            {frequentlyBought.length > 0 && (
              <div className="pt-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                  Complete the Set
                </h3>

                <div className="space-y-3">
                  {frequentlyBought.map((item) => {
                    const sel = selectedAddons.some(
                      (a) =>
                        (a._id || a.id) === (item._id || item.id)
                    );
                    return (
                      <div
                        key={item._id || item.id}
                        onClick={() => toggleAddon(item)}
                        className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                          sel
                            ? "border-black bg-gray-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="w-12 h-12 bg-white rounded-lg p-2 border border-gray-100">
                          <img
                            src={item.imageURL}
                            alt=""
                            className="w-full object-contain"
                          />
                        </div>

                        <div className="flex-grow">
                          <p className="text-[10px] font-bold uppercase truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            ₹{item.finalPrice?.toLocaleString()}
                          </p>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            sel
                              ? "bg-black border-black text-white"
                              : "border-gray-200 text-transparent"
                          }`}
                        >
                          <Check size={10} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedAddons.length > 0 && (
                  <button
                    onClick={handleBundleBuy}
                    className="mt-4 w-full py-3 bg-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white"
                  >
                    Add Ensemble (₹
                    {(
                      (currentProduct.finalPrice || 0) +
                      selectedAddons.reduce(
                        (acc, curr) => acc + (curr.finalPrice || 0),
                        0
                      )
                    ).toLocaleString()}
                    )
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className="mt-40 border-t border-gray-100 pt-20">
          <div className="flex gap-12 mb-12 border-b">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[11px] font-black uppercase tracking-[0.3em] ${
                  activeTab === tab
                    ? "text-black border-b-2 border-black"
                    : "text-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            {activeTab === "description" && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {currentProduct.description}
              </p>
            )}

            {activeTab === "specifications" && (
              <div className="space-y-4">
                {currentProduct?.specs &&
                  Object.entries(currentProduct.specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b pb-2"
                    >
                      <span className="text-[10px] text-gray-400 uppercase">
                        {key}
                      </span>
                      <span className="text-sm">{val}</span>
                    </div>
                  ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* RELATED */}
        <div className="mt-40">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[10px] text-gray-400 uppercase italic">
                Curated Selection
              </p>
              <h3 className="text-3xl font-medium">You Might Also Like</h3>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full border flex items-center justify-center hover:bg-black hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full border flex items-center justify-center hover:bg-black hover:text-white"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto no-scrollbar pb-4"
          >
            {similarProducts.map((p) => (
              <Link
                key={p._id || p.id}
                to={`/product/${p._id || p.id}`}
                className="min-w-[220px] group"
              >
                <div className="aspect-[4/5] bg-[#F7F7F7] p-6 rounded-sm flex items-center justify-center overflow-hidden relative">
                  <img
                    src={p.imageURL}
                    alt=""
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-all"
                  />
                </div>

                <p className="text-[9px] text-gray-400 uppercase mt-3">
                  {p.brand}
                </p>
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-sm text-gray-600">
                  ₹{p.finalPrice?.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <style>
        {`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </div>
  );
};

export default ProductPage;