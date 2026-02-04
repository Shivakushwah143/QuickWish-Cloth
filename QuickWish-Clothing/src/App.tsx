import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  BrowserRouter, Routes, Route, Link, useParams, useNavigate, useLocation, Navigate 
} from 'react-router-dom';
import { 
  ShoppingBag, Heart, Menu, X, Search, ChevronRight, 
  ArrowRight, Minus, Plus, Trash2, CheckCircle, Instagram, 
  Twitter, Facebook, ArrowLeft, Star, Lock, MapPin, Phone, Mail
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** * ===================================================================================
 * 🎨 DESIGN SYSTEM & CONFIGURATION
 * ===================================================================================
 * * Brand: QuickWish (Bold Gen-Z Fashion)
 * Colors:
 * - Primary (Deep Plum): #4B1D3F
 * - Accent (Hot Rose): #E91E63
 * - Background (Lilac White): #FAF7FB
 * - Surface (Pure White): #FFFFFF
 * - Text (Near Black): #0F0F0F
 * - Muted (Gray): #6B6B6B
 * - Border: #DADADA
 * * Typography:
 * - Headings: Poppins (600/700)
 * - Body: Inter (400/500)
 */

// Utility for Tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Inject Fonts Dynamically
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #FAF7FB; color: #0F0F0F; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; }
  `}</style>
);

// ===================================================================================
// 🧱 DATA MODELS
// ===================================================================================

type Category = 'Dresses' | 'Tops' | 'Bottoms' | 'Ethnic' | 'Co-ords';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: Category;
  images: string[];
  description: string;
  sizes: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

// ===================================================================================
// 🛍️ MOCK DATA
// ===================================================================================

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Midnight Velvet Maxi',
    price: 2499,
    originalPrice: 4999,
    category: 'Dresses',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A luxurious velvet gown with a thigh-high slit. Perfect for evening parties in Indore. Features a breathable lining and premium stitch.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Neon Pop Streetwear Set',
    price: 1899,
    category: 'Co-ords',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Stand out with this bold neon co-ord set. Soft cotton blend for maximum comfort and style.',
    sizes: ['S', 'M', 'L'],
    inStock: true,
    rating: 4.5,
    reviews: 89
  },
  {
    id: '3',
    name: 'Jaipur Block Print Kurta',
    price: 1299,
    originalPrice: 1999,
    category: 'Ethnic',
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605763240004-7e93b172d754?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Authentic hand-block print from Rajasthan tailored for the modern silhouette. 100% Cotton.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    rating: 4.9,
    reviews: 210
  },
  {
    id: '4',
    name: 'Urban Chic Blazer',
    price: 3499,
    category: 'Dresses',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548624149-f321d7ad0503?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Power dressing made easy. Structured fit with a feminine cut. Ideal for office or casual brunch.',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    rating: 4.7,
    reviews: 56
  },
  {
    id: '5',
    name: 'Boho Floral Sundress',
    price: 1599,
    category: 'Dresses',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550614000-4b9519e02a48?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Lightweight, flowy, and perfect for the Indian summer. Floral prints that never go out of style.',
    sizes: ['S', 'M', 'L'],
    inStock: true,
    rating: 4.6,
    reviews: 142
  },
  {
    id: '6',
    name: 'Satin Slip Skirt',
    price: 999,
    originalPrice: 1499,
    category: 'Bottoms',
    images: [
      'https://images.unsplash.com/photo-1582142388030-4669bf7c473c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582142388030-4669bf7c473c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582142388030-4669bf7c473c?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'High-waisted satin skirt. Versatile enough to pair with a tee or a blouse.',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    rating: 4.4,
    reviews: 78
  }
];

// ===================================================================================
// 🧠 STATE MANAGEMENT
// ===================================================================================

interface ShopContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('qw_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('qw_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('qw_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('qw_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart = (product: Product, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => item.id === product.id && item.selectedSize === size 
            ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, selectedSize: size, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const updateQuantity = (id: string, size: string, qty: number) => {
    if (qty < 1) return;
    setCart(prev => prev.map(item => item.id === id && item.selectedSize === size ? { ...item, quantity: qty } : item));
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <ShopContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQuantity, toggleWishlist, clearCart, cartTotal, cartCount }}>
      {children}
    </ShopContext.Provider>
  );
};

const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context;
};

// ===================================================================================
// 🧩 UI COMPONENTS
// ===================================================================================

const Button = ({ children, variant = 'primary', className, ...props }: any) => {
  const variants = {
    primary: "bg-[#4B1D3F] text-white hover:bg-[#3a1631] shadow-md hover:shadow-lg",
    secondary: "bg-white border border-[#DADADA] text-[#0F0F0F] hover:bg-gray-50 hover:border-[#4B1D3F]",
    accent: "bg-[#E91E63] text-white hover:bg-[#d81557] shadow-lg shadow-[#E91E63]/30",
    outline: "border-2 border-[#4B1D3F] text-[#4B1D3F] hover:bg-[#4B1D3F] hover:text-white"
  };
  
  return (
    <button className={cn("inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95", variants[variant as keyof typeof variants], className)} {...props}>
      {children}
    </button>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// ===================================================================================
// 🏗️ LAYOUT
// ===================================================================================

const Navbar = () => {
  const { cartCount, wishlist } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF7FB]/90 backdrop-blur-md border-b border-[#DADADA]">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <button className="md:hidden text-[#4B1D3F]" onClick={() => setIsOpen(true)}><Menu /></button>

        <Link to="/" className="text-2xl md:text-3xl font-bold text-[#4B1D3F] tracking-tight">
          QuickWish<span className="text-[#E91E63]">.</span>
        </Link>

        <div className="hidden md:flex gap-8">
          {['Home', 'Shop', 'About', 'Contact'].map(name => {
            const path = name === 'Home' ? '/' : `/${name.toLowerCase()}`;
            return (
              <Link key={path} to={path} className={cn("text-sm font-medium transition-colors hover:text-[#E91E63]", location.pathname === path ? "text-[#E91E63] font-semibold" : "text-[#0F0F0F]")}>
                {name}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/wishlist" className="hidden md:block p-2 hover:bg-white rounded-full transition-colors text-[#4B1D3F] relative">
            <Heart size={20} className={wishlist.length > 0 ? "fill-[#E91E63] stroke-[#E91E63]" : ""} />
          </Link>
          <Link to="/cart" className="relative p-2 hover:bg-white rounded-full transition-colors text-[#4B1D3F]">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-[#E91E63] text-white text-[10px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={cn("fixed inset-0 z-50 transform transition-transform duration-300 md:hidden", isOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
        <div className="relative w-[80%] max-w-[300px] h-full bg-[#FAF7FB] p-6 shadow-2xl flex flex-col">
          <button className="self-end text-[#4B1D3F] mb-8" onClick={() => setIsOpen(false)}><X /></button>
          <div className="flex flex-col gap-6">
            {['Home', 'Shop', 'Wishlist', 'Cart', 'About', 'Contact'].map(item => (
              <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-xl font-bold text-[#4B1D3F] hover:text-[#E91E63]">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-[#4B1D3F] text-white pt-16 pb-8 rounded-t-[24px] mt-auto">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <div>
        <h3 className="text-2xl font-bold mb-4">QuickWish<span className="text-[#E91E63]">.</span></h3>
        <p className="text-white/70 text-sm leading-relaxed">Indore's boldest fashion edit for the Gen-Z soul. We don't just sell clothes; we sell confidence.</p>
      </div>
      <div>
        <h4 className="font-bold mb-4 text-[#E91E63]">Shop</h4>
        <ul className="space-y-2 text-sm text-white/80">
          <li><Link to="/shop">New Arrivals</Link></li>
          <li><Link to="/shop">Best Sellers</Link></li>
          <li><Link to="/shop">Sale</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4 text-[#E91E63]">Legal</h4>
        <ul className="space-y-2 text-sm text-white/80">
          <li><Link to="/policies/privacy">Privacy Policy</Link></li>
          <li><Link to="/policies/terms">Terms of Service</Link></li>
          <li><Link to="/policies/refund">Refund Policy</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4 text-[#E91E63]">Socials</h4>
        <div className="flex gap-4">
          {[Instagram, Twitter, Facebook].map((Icon, i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E91E63] transition-colors cursor-pointer"><Icon size={20} /></div>
          ))}
        </div>
      </div>
    </div>
    <div className="border-t border-white/10 pt-8 text-center text-xs text-white/50">© 2024 QuickWish Fashion. Designed in Indore.</div>
  </footer>
);

const ProductCard = ({ product }: { product: Product }) => {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const isWishlisted = wishlist.includes(product.id);
  const navigate = useNavigate();

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#DADADA]/50 flex flex-col h-full">
      <div className="relative aspect-[3/4] overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all">
          <Heart size={18} className={isWishlisted ? "fill-[#E91E63] stroke-[#E91E63]" : "stroke-[#0F0F0F]"} />
        </button>
        {product.originalPrice && <span className="absolute top-3 left-3 bg-[#E91E63] text-white text-[10px] px-2 py-1 font-bold rounded-sm shadow-md">SALE</span>}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent pt-10">
           <button onClick={(e) => { e.stopPropagation(); addToCart(product, product.sizes[0]); }} className="w-full bg-white text-[#4B1D3F] py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-[#FAF7FB]">Quick Add ({product.sizes[0]})</button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-[#6B6B6B] mb-1">{product.category}</div>
        <Link to={`/product/${product.id}`} className="font-bold text-[#0F0F0F] hover:text-[#E91E63] transition-colors mb-2 line-clamp-1">{product.name}</Link>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-[#0F0F0F]">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="text-sm text-[#6B6B6B] line-through">₹{product.originalPrice.toLocaleString()}</span>}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium bg-[#FAF7FB] px-2 py-1 rounded-md text-[#4B1D3F]">
            <Star size={12} className="fill-[#E91E63] stroke-[#E91E63]" /> {product.rating}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================================================================================
// 📄 PAGES
// ===================================================================================

const HomePage = () => {
  const featured = PRODUCTS.slice(0, 4);
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-[#4B1D3F]">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Hero" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <Badge className="bg-[#E91E63] text-white mb-6 inline-block">New Season 2024</Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Be Bold. Be You.<br/>Be QuickWish.</h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-light">The ultimate fashion destination for Indore's trendsetters.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/shop"><Button variant="accent" className="w-full md:w-auto text-lg px-8">Shop Collection</Button></Link>
            <Link to="/about"><Button variant="secondary" className="w-full md:w-auto text-lg px-8 bg-transparent text-white border-white hover:bg-white hover:text-[#4B1D3F]">Our Story</Button></Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-[#4B1D3F]">Shop by Vibe</h2>
          <Link to="/shop" className="text-[#E91E63] font-medium flex items-center gap-1 hover:gap-2 transition-all">View All <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Party Edit', 'Ethnic Roots', 'Street Chic'].map((cat, idx) => (
            <Link to="/shop" key={idx} className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img src={`https://source.unsplash.com/random/800x1000/?fashion,${cat.split(' ')[0]}`} alt={cat} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{cat}</h3>
                <span className="text-white/80 text-sm group-hover:text-[#E91E63] transition-colors flex items-center gap-2">Explore <ArrowRight size={14}/></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-white py-20 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#4B1D3F] mb-12 text-center">Trending Right Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

const ShopPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
      <div>
        <h1 className="text-4xl font-bold text-[#4B1D3F] mb-2">All Products</h1>
        <p className="text-[#6B6B6B]">Curated styles for the modern you.</p>
      </div>
      <div className="flex gap-4 mt-4 md:mt-0">
        <select className="px-4 py-2 border border-[#DADADA] rounded-lg bg-white text-sm focus:border-[#4B1D3F] outline-none">
          <option>Sort by: Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  </div>
);

const ProductDetailsPage = () => {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id);
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [mainImg, setMainImg] = useState(product?.images[0]);
  
  if (!product) return <div className="p-20 text-center">Product not found</div>;
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in zoom-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setMainImg(img)} className={cn("w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all", mainImg === img ? "border-[#4B1D3F]" : "border-transparent")}>
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-lg">
            <img src={mainImg || product.images[0]} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-[#FAF7FB] text-[#4B1D3F] border border-[#DADADA]">{product.category}</Badge>
            <div className="flex items-center gap-1 text-[#E91E63] font-bold"><Star size={16} className="fill-[#E91E63]" /> {product.rating} ({product.reviews} reviews)</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#4B1D3F] mb-4">{product.name}</h1>
          <div className="flex items-end gap-4 mb-8">
            <span className="text-3xl font-bold text-[#0F0F0F]">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="text-xl text-[#6B6B6B] line-through decoration-red-500 decoration-2">₹{product.originalPrice.toLocaleString()}</span>}
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between mb-3 text-sm font-medium">
              <span>Select Size</span>
              <button className="text-[#E91E63] underline">Size Guide</button>
            </div>
            <div className="flex gap-3">
              {product.sizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)} className={cn("w-14 h-14 rounded-lg border-2 font-bold transition-all", selectedSize === size ? "border-[#4B1D3F] bg-[#4B1D3F] text-white" : "border-[#DADADA] text-[#0F0F0F] hover:border-[#4B1D3F]")}>{size}</button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <Button onClick={() => selectedSize && addToCart(product, selectedSize)} disabled={!selectedSize} variant="accent" className="flex-1 h-14 text-lg shadow-xl shadow-[#E91E63]/20">
              {selectedSize ? 'Add to Cart' : 'Select Size'}
            </Button>
            <button onClick={() => toggleWishlist(product.id)} className="w-14 h-14 flex items-center justify-center rounded-lg border-2 border-[#DADADA] hover:border-[#E91E63] group transition-all">
              <Heart className={cn("transition-colors", isWishlisted ? "fill-[#E91E63] stroke-[#E91E63]" : "stroke-[#6B6B6B] group-hover:stroke-[#E91E63]")} />
            </button>
          </div>

          <div className="prose prose-sm text-[#6B6B6B] bg-white p-6 rounded-xl border border-[#DADADA]/50">
            <h4 className="text-[#0F0F0F] font-bold mb-2">Description</h4>
            <p>{product.description}</p>
            <div className="mt-4 pt-4 border-t border-[#DADADA]/50 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2"><CheckCircle size={14} className="text-green-600"/> 100% Original</div>
              <div className="flex items-center gap-2"><CheckCircle size={14} className="text-green-600"/> Easy 14 Days Returns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-[#FAF7FB] rounded-full flex items-center justify-center mb-6"><ShoppingBag size={40} className="text-[#4B1D3F] opacity-50" /></div>
      <h2 className="text-2xl font-bold text-[#4B1D3F] mb-2">Your cart is empty</h2>
      <p className="text-[#6B6B6B] mb-8">Time to fill it with something trendy!</p>
      <Link to="/shop"><Button variant="primary">Start Shopping</Button></Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold text-[#4B1D3F] mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-[#DADADA]/50">
              <img src={item.images[0]} alt={item.name} className="w-24 h-32 object-cover rounded-lg" />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#0F0F0F] text-lg">{item.name}</h3>
                    <p className="text-sm text-[#6B6B6B]">Size: {item.selectedSize}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-[#6B6B6B] hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3 bg-[#FAF7FB] rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)} className="p-1 hover:bg-white rounded-md shadow-sm"><Minus size={16} /></button>
                    <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)} className="p-1 hover:bg-white rounded-md shadow-sm"><Plus size={16} /></button>
                  </div>
                  <p className="font-bold text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#DADADA]/50 h-fit">
          <h3 className="font-bold text-xl mb-6 text-[#4B1D3F]">Order Summary</h3>
          <div className="space-y-4 mb-6 text-sm">
            <div className="flex justify-between"><span className="text-[#6B6B6B]">Subtotal</span><span className="font-bold">₹{cartTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-[#6B6B6B]">Shipping</span><span className="text-green-600 font-bold">Free</span></div>
            <div className="flex justify-between border-t border-[#DADADA] pt-4"><span className="text-lg font-bold">Total</span><span className="text-lg font-bold text-[#4B1D3F]">₹{cartTotal.toLocaleString()}</span></div>
          </div>
          <Button onClick={() => navigate('/checkout')} variant="primary" className="w-full h-12 uppercase tracking-wider text-sm">Checkout</Button>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { cartTotal, clearCart } = useShop();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      clearCart();
      setLoading(false);
      navigate('/success');
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-[#4B1D3F] mb-8 text-center">Secure Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#DADADA]">
            <h3 className="font-bold mb-4 flex items-center gap-2"><MapPin size={18} className="text-[#E91E63]"/> Shipping Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="First Name" className="w-full p-3 bg-[#FAF7FB] rounded-lg text-sm border-transparent focus:border-[#4B1D3F] border-2 outline-none" />
                <input required placeholder="Last Name" className="w-full p-3 bg-[#FAF7FB] rounded-lg text-sm border-transparent focus:border-[#4B1D3F] border-2 outline-none" />
              </div>
              <input required placeholder="Address" className="w-full p-3 bg-[#FAF7FB] rounded-lg text-sm border-transparent focus:border-[#4B1D3F] border-2 outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="City" className="w-full p-3 bg-[#FAF7FB] rounded-lg text-sm border-transparent focus:border-[#4B1D3F] border-2 outline-none" />
                <input required placeholder="Pincode" className="w-full p-3 bg-[#FAF7FB] rounded-lg text-sm border-transparent focus:border-[#4B1D3F] border-2 outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#DADADA]">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Lock size={18} className="text-[#E91E63]"/> Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-[#4B1D3F] bg-[#FAF7FB] rounded-lg cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="accent-[#4B1D3F] w-5 h-5" />
                <div className="flex flex-col"><span className="font-bold text-[#0F0F0F]">Cash on Delivery</span><span className="text-xs text-[#6B6B6B]">Pay securely at your doorstep</span></div>
              </label>
              <div className="group relative">
                <label className="flex items-center gap-3 p-4 border border-[#DADADA] rounded-lg opacity-50 cursor-not-allowed">
                  <input type="radio" name="payment" disabled className="w-5 h-5" />
                  <span className="font-bold">UPI / Online Payment</span>
                </label>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#0F0F0F] text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Online payments coming soon 💫</div>
              </div>
            </div>
          </div>

          <Button type="submit" variant="accent" className="w-full h-14 text-lg shadow-xl shadow-[#E91E63]/20" disabled={loading}>
            {loading ? 'Processing...' : `Place Order • ₹${cartTotal.toLocaleString()}`}
          </Button>
        </form>

        <div className="bg-[#FAF7FB] p-8 rounded-2xl h-fit border border-[#DADADA]">
          <h3 className="font-bold text-xl mb-6 text-[#4B1D3F]">Your Order</h3>
          <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-[#DADADA]">
            <span>Total Amount</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="mt-8 flex items-start gap-3 bg-[#E91E63]/10 p-4 rounded-lg">
            <CheckCircle className="text-[#E91E63] shrink-0" size={20} />
            <p className="text-xs text-[#4B1D3F] leading-relaxed">By placing this order, you agree to receive updates on WhatsApp regarding your shipment. Returns are accepted within 14 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessPage = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-in zoom-in duration-500">
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-100"><CheckCircle size={48} className="text-green-600" /></div>
    <h1 className="text-4xl font-bold text-[#4B1D3F] mb-4">Order Confirmed!</h1>
    <p className="text-[#6B6B6B] mb-8 max-w-md text-lg">Thank you for choosing QuickWish! Your order #IND-{Math.floor(Math.random()*10000)} is being prepared with love.</p>
    <Link to="/"><Button variant="primary">Continue Shopping</Button></Link>
  </div>
);

const WishlistPage = () => {
  const { wishlist } = useShop();
  const items = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#4B1D3F] mb-8 flex items-center gap-2"><Heart className="fill-[#E91E63] stroke-[#E91E63]" /> My Wishlist</h1>
      {items.length === 0 ? <p className="text-[#6B6B6B]">Your wishlist is empty.</p> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{items.map(p => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
};

// ===================================================================================
// 📄 STATIC PAGES
// ===================================================================================

const AboutPage = () => (
  <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
    <h1 className="text-4xl font-bold text-[#4B1D3F] mb-6">Our Story</h1>
    <p className="text-lg text-[#6B6B6B] leading-relaxed mb-8">
      Born in the heart of Indore, <strong>QuickWish</strong> started with a simple idea: Fashion should be bold, quick, and undeniably you. We curate styles for the Gen-Z woman who isn't afraid to stand out. From the bustling streets of Sarafa to the quiet elegance of coffee shops in Palasia, our designs are made to turn heads.
    </p>
    <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop" className="w-full h-64 object-cover rounded-2xl mb-8 shadow-xl" alt="Indore Fashion" />
  </div>
);

const ContactPage = () => (
  <div className="container mx-auto px-4 py-16 max-w-lg">
    <h1 className="text-3xl font-bold text-[#4B1D3F] mb-8 text-center">Get in Touch</h1>
    <div className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-[#DADADA]">
      <div className="flex items-center gap-4"><Phone className="text-[#E91E63]" /> <span>+91 98765 43210</span></div>
      <div className="flex items-center gap-4"><Mail className="text-[#E91E63]" /> <span>hello@quickwish.in</span></div>
      <div className="flex items-center gap-4"><MapPin className="text-[#E91E63]" /> <span>Vijay Nagar, Indore, MP</span></div>
    </div>
  </div>
);

const Badge = ({ children, className }: { children: ReactNode, className?: string }) => (
  <span className={cn("px-3 py-1 text-xs uppercase font-bold tracking-wider rounded-md", className)}>{children}</span>
);

const PoliciesPage = ({ type }: { type: string }) => (
  <div className="container mx-auto px-4 py-12 max-w-3xl prose">
    <h1 className="text-3xl font-bold text-[#4B1D3F] mb-4 capitalize">{type} Policy</h1>
    <p className="text-[#6B6B6B]">At QuickWish, we believe in transparency. This is a demo text for the {type} policy. In a real application, this would contain legal details about data usage, returns, or service terms tailored to Indian e-commerce laws.</p>
  </div>
);

// ===================================================================================
// 🚀 APP ROOT
// ===================================================================================

export default function App() {
  return (
    <BrowserRouter>
      <FontLoader />
      <ShopProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#FAF7FB] selection:bg-[#E91E63] selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/policies/:type" element={<PoliciesPage type="privacy" />} /> {/* Dynamic prop based on url in real app */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ShopProvider>
    </BrowserRouter>
  );
}