import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, Zap, ChevronRight, ArrowRight, Plus, Check, ThumbsUp } from 'lucide-react';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { CartContext } from "../App";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);
  
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReadMore, setIsReadMore] = useState(false);
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const isInCart = cart.some(item => (item.id === id || item._id === id));

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        setCurrentProduct(data);
        window.scrollTo(0, 0);

        // 1. Frequently Bought Together (Current ID exclude karke)
        // Yahan 'accessories' ya same 'category' fetch kar sakte ho
        const resAddons = await fetch(`http://localhost:5000/api/products?category=accessories&limit=5`);
        const addonsData = await resAddons.json();
        setFrequentlyBought(addonsData.filter(p => p.id !== id).slice(0, 3));

        // 2. Similar Products 
        const resSimilar = await fetch(`http://localhost:5000/api/products?category=${data.category}&limit=10`);
        const similarData = await resSimilar.json();
        setSimilarProducts(similarData.filter(p => p.id !== id));

      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const toggleAddon = (prod) => {
    if (selectedAddons.find(a => a.id === prod.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== prod.id));
    } else {
      setSelectedAddons([...selectedAddons, prod]);
    }
  };

  const handleFullPurchase = () => {
    if (!isInCart) addToCart(currentProduct);
    selectedAddons.forEach(addon => addToCart(addon));
    navigate('/cart');
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-blue-600">Loading Product...</div>;

  return (
    <div className="bg-[#f1f3f6] min-h-screen font-sans">
      <Navbar />

      <main className="max-w-[1280px] mx-auto py-2 px-2 mt-14">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          
          {/* LEFT: STICKY IMAGE (Sirf Ratings tak fixed rahegi) */}
          <div className="md:w-[40%] md:sticky md:top-[70px]">
            <div className="bg-white p-4 border rounded-sm">
              <div className="border p-2 mb-4 h-[450px] flex items-center justify-center overflow-hidden">
                <img src={currentProduct.imageURL} alt={currentProduct.name} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { if(isInCart) navigate('/cart'); else addToCart(currentProduct); }} className="flex-1 bg-[#ff9f00] text-white py-4 rounded-sm font-bold text-lg uppercase shadow-sm">
                  {isInCart ? "Go to Cart" : "Add to Cart"}
                </button>
                <button className="flex-1 bg-[#fb641b] text-white py-4 rounded-sm font-bold text-lg uppercase shadow-sm">Buy Now</button>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="md:w-[60%] space-y-4">
            <div className="bg-white p-6 border rounded-sm">
              <nav className="text-xs text-gray-500 mb-2 uppercase">Home &gt; {currentProduct.category} &gt; {currentProduct.brand}</nav>
              <h1 className="text-xl font-medium text-gray-900 leading-tight">{currentProduct.name}</h1>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center">{currentProduct.rating} <Star size={10} className="ml-0.5 fill-current" /></span>
                <span className="text-gray-500 text-sm font-bold">{currentProduct.reviewsCount} Ratings</span>
              </div>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold">₹{currentProduct.finalPrice?.toLocaleString()}</span>
                <span className="text-gray-500 line-through text-lg">₹{currentProduct.price?.toLocaleString()}</span>
                <span className="text-green-600 font-bold text-sm">{currentProduct.discount}% off</span>
              </div>

              {/* FREQUENTLY BOUGHT TOGETHER (Dynamic Filtering applied) */}
              <div className="mt-8 border rounded-sm p-5 bg-[#f5faff] border-blue-100">
                <h3 className="text-base font-bold mb-4 text-gray-800">Frequently Bought Together</h3>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  <div className="flex-shrink-0 text-center">
                    <div className="w-20 h-20 bg-white p-1 border rounded-sm"><img src={currentProduct.imageURL} className="h-full w-full object-contain mx-auto" alt="" /></div>
                    <p className="text-[10px] mt-1 font-bold text-blue-600 uppercase">Primary</p>
                  </div>
                  
                  {frequentlyBought.map((item) => (
                    <React.Fragment key={item.id}>
                      <Plus size={16} className="text-gray-400 flex-shrink-0" />
                      <div className="flex-shrink-0 w-24 text-center cursor-pointer group" onClick={() => toggleAddon(item)}>
                        <div className="relative w-20 h-20 bg-white p-1 border rounded-sm mx-auto">
                          <img src={item.imageURL} className="h-full w-full object-contain mx-auto" alt="" />
                          <div className={`absolute -top-2 -right-2 rounded-full border shadow-sm ${selectedAddons.find(a => a.id === item.id) ? 'bg-blue-600 text-white' : 'bg-white text-gray-300'}`}>
                            <Check size={14} />
                          </div>
                        </div>
                        <p className="text-[10px] mt-1 truncate font-medium group-hover:text-blue-600 transition">{item.name}</p>
                        <p className="text-xs font-bold">₹{item.finalPrice}</p>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-blue-100 flex justify-between items-center">
                   <p className="text-sm font-medium">Combo Price: <span className="text-lg font-bold">₹{(currentProduct.finalPrice + selectedAddons.reduce((a,b)=>a+b.finalPrice, 0)).toLocaleString()}</span></p>
                   <button onClick={handleFullPurchase} className="bg-[#ff9f00] text-white px-5 py-2 rounded-sm font-bold text-xs uppercase shadow-md active:scale-95 transition">Add {selectedAddons.length + 1} items</button>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-bold border-b pb-2 mb-3">Highlights</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-gray-700">
                  {currentProduct.highlights?.map((h, i) => <li key={i}>• {h}</li>)}
                </ul>
              </div>

              <div className="mt-8 border-t pt-6">
                <h3 className="font-bold mb-4">Specifications</h3>
                <div className="border rounded-sm overflow-hidden">
                  {currentProduct.specs && Object.entries(currentProduct.specs).map(([k, v], i) => (
                    <div key={k} className={`flex text-sm p-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                      <span className="w-1/3 text-gray-500">{k}</span>
                      <span className="w-2/3 font-medium text-gray-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RATINGS SECTION (No Write Option, Only Stats) --- */}
        <div className="mt-4 bg-white p-8 border rounded-sm">
          <h3 className="text-xl font-bold mb-6">Ratings & Reviews</h3>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="text-center w-full md:w-48">
              <h2 className="text-5xl font-bold flex items-center justify-center gap-2">
                {currentProduct.rating} <Star size={35} className="fill-current text-gray-800" />
              </h2>
              <p className="text-gray-400 mt-2 text-sm font-medium uppercase tracking-widest">{currentProduct.reviewsCount} Ratings</p>
            </div>

            {/* Rating Bar Chart (Flipkart Style) */}
            <div className="flex-1 w-full max-w-md space-y-2">
              {[5, 4, 3, 2, 1].map((num) => (
                <div key={num} className="flex items-center gap-4 text-xs font-bold">
                  <span className="w-2 flex items-center">{num} <Star size={10} className="ml-1" /></span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${num > 3 ? 'bg-green-600' : num === 3 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${Math.random() * 80 + 10}%` }}></div>
                  </div>
                  <span className="w-10 text-gray-400 text-right">{Math.floor(Math.random() * 500)}</span>
                </div>
              ))}
              
            </div>
          </div>
        </div>

        {/* --- SIMILAR PRODUCTS --- */}
        <div className="mt-4 bg-white p-6 border rounded-sm">
           <h3 className="text-lg font-bold mb-6">Similar Products</h3>
           <div className="flex overflow-x-auto gap-6 no-scrollbar pb-4">
              {similarProducts.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="min-w-[180px] text-center group border p-3 hover:shadow-md transition bg-white">
                  <div className="h-40 flex items-center justify-center mb-2">
                    <img src={p.imageURL} className="max-h-full max-w-full object-contain group-hover:scale-105 transition" alt="" />
                  </div>
                  <p className="text-xs font-bold truncate text-gray-800 uppercase">{p.brand}</p>
                  <p className="text-xs font-medium truncate text-gray-500">{p.name}</p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="font-bold text-gray-900">₹{p.finalPrice}</span>
                  </div>
                </Link>
              ))}
           </div>
        </div>

        {/* --- YOU MIGHT BE INTERESTED IN --- */}
        <div className="mt-4 bg-white p-6 border rounded-sm mb-10">
           <h3 className="text-lg font-bold mb-6 border-b pb-4">You Might Be Interested In</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarProducts.slice(0, 6).map(p => (
                <div key={p.id} className="p-4 rounded-sm flex flex-col justify-between hover:shadow-sm border border-gray-100 bg-gray-50/30">
                  <Link to={`/product/${p.id}`}><img src={p.imageURL} className="h-32 object-contain mx-auto" alt="" /></Link>
                  <div className="mt-4">
                    <p className="text-xs font-medium line-clamp-2 mb-2 text-gray-600">{p.name}</p>
                    <p className="font-bold text-gray-900">₹{p.finalPrice}</p>
                    <button onClick={() => addToCart(p)} className="w-full mt-3 bg-white border border-gray-300 py-1.5 text-xs font-bold rounded-sm uppercase hover:bg-gray-100 transition">Add To Cart</button>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;