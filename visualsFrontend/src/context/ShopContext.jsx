import { createContext, useEffect, useState, useMemo } from "react";

// Clean up cart items that no longer exist in products
// (The useEffect for this logic should be placed inside the ShopContextProvider component, not at the top level)
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut
import { auth } from '../Config';

export const ShopContext = createContext();
// Use VITE_BACKEND_URL from environment

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('cartItems');
            const parsed = saved ? JSON.parse(saved) : {};
            // Normalize any nested shapes saved previously
            const normalized = {};
            Object.entries(parsed).forEach(([itemId, value]) => {
                if (value == null) return;
                if (typeof value === 'object') {
                    normalized[itemId] = Object.values(value).reduce((s, v) => s + (Number(v) || 0), 0);
                } else {
                    normalized[itemId] = Number(value) || 0;
                }
            });
            return normalized;
        } catch (err) {
            return {};
        }
    });
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch Products
    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
        }
    };

    // Add To Cart - returns a promise that resolves after local update and server sync (if logged in)
    const addToCart = async (itemId, quantity = 1) => {
        try {
            let cartData = structuredClone(cartItems);
            const existing = cartData[itemId];
            let existingCount = 0;
            if (existing != null) {
                if (typeof existing === 'object') {
                    existingCount = Object.values(existing).reduce((s, v) => s + (Number(v) || 0), 0);
                } else {
                    existingCount = Number(existing) || 0;
                }
            }
            cartData[itemId] = existingCount + quantity;
            setCartItems(cartData);

            // If logged in, sync with server but don't block UI on failure
            if (token) {
                try {
                    await axios.post(
                        `${backendUrl}/api/cart/add`,
                        { itemId, quantity },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                } catch (error) {
                }
            }
            return true;
        } catch (err) {
            return false;
        }
    };

    // Update Quantity
    const updateQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        // If the stored value is nested, convert to flat count
        cartData[itemId] = quantity;
        setCartItems(cartData);
        if (token) {
            try {
                await axios.post(
                    `${backendUrl}/api/cart/update`,
                    { itemId, quantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
            }
        }
    };

    // Get User Cart - merge with local cart
    const getUserCart = async (currentToken, persistToServer = false) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/get`,
                {},
                { headers: { Authorization: `Bearer ${currentToken}` } }
            );
            if (response.data.success && response.data.cartData) {
                // Normalize server cart shapes (support nested size objects)
                const serverCart = response.data.cartData;
                const normalizedServer = {};
                Object.entries(serverCart).forEach(([itemId, value]) => {
                    if (value == null) return;
                    if (typeof value === 'object') {
                        const sum = Object.values(value).reduce((s, v) => s + (Number(v) || 0), 0);
                        normalizedServer[itemId] = sum;
                    } else {
                        normalizedServer[itemId] = Number(value) || 0;
                    }
                });

                // Normalize local cart (from current state/localStorage) and filter out deleted products
                const localRaw = (() => {
                    try {
                        const saved = localStorage.getItem('cartItems');
                        return saved ? JSON.parse(saved) : {};
                    } catch (e) { return {}; }
                })();
                // Only keep items that exist in the current products list
                const validProductIds = new Set(products.map(p => String(p._id)));
                const normalizedLocal = {};
                Object.entries(localRaw).forEach(([itemId, value]) => {
                    if (!validProductIds.has(itemId)) return;
                    if (value == null) return;
                    if (typeof value === 'object') {
                        normalizedLocal[itemId] = Object.values(value).reduce((s, v) => s + (Number(v) || 0), 0);
                    } else {
                        normalizedLocal[itemId] = Number(value) || 0;
                    }
                });

                // Decide merging strategy:
                // - On fresh login (persistToServer === true) merge local guest items into server and persist.
                // - On refresh or non-fresh login (persistToServer === false) prefer server cart if present, else fall back to local.
                let merged;
                if (persistToServer) {
                    merged = { ...normalizedServer };
                    Object.entries(normalizedLocal).forEach(([itemId, qty]) => {
                        if (!merged[itemId]) merged[itemId] = qty;
                        else merged[itemId] = (merged[itemId] || 0) + (qty || 0);
                    });
                } else {
                    merged = Object.keys(normalizedServer).length ? normalizedServer : normalizedLocal;
                }

                // Remove all items with quantity 0 from merged cart
                Object.keys(merged).forEach(itemId => {
                    if (!merged[itemId] || merged[itemId] <= 0) {
                        delete merged[itemId];
                    }
                });

                setCartItems(merged);

                // Persist merged cart back to server only when explicitly requested
                if (persistToServer && currentToken) {
                    try {
                        for (const [itemId, qty] of Object.entries(merged)) {
                            await axios.post(
                                `${backendUrl}/api/cart/update`,
                                { itemId, quantity: qty },
                                { headers: { Authorization: `Bearer ${currentToken}` } }
                            );
                        }
                        for (const [itemId] of Object.entries(normalizedServer)) {
                            if (!merged[itemId]) {
                                await axios.post(
                                    `${backendUrl}/api/cart/update`,
                                    { itemId, quantity: 0 },
                                    { headers: { Authorization: `Bearer ${currentToken}` } }
                                );
                            }
                        }
                    } catch (err) {
                    }
                }
            }
        } catch (error) {
        }
    };


    // Validate cart - remove items only when the product is deleted from admin panel (not just when quantity is 0)
    const validateCart = async (productsToCheck = products) => {
        if (!productsToCheck || productsToCheck.length === 0) return;

        setCartItems(prevCart => {
            const validatedCart = { ...prevCart };
            let hasChanges = false;

            for (const itemId of Object.keys(validatedCart)) {
                const productExists = productsToCheck.find(p => p._id === itemId);
                if (!productExists) {
                    delete validatedCart[itemId];
                    hasChanges = true;
                    // Remove from server cart if logged in
                    if (token) {
                        try {
                            axios.post(
                                `${backendUrl}/api/cart/update`,
                                { itemId, quantity: 0 },
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                        } catch (err) {
                        }
                    }
                }
            }

            if (hasChanges) {
                try { localStorage.setItem('cartItems', JSON.stringify(validatedCart)); } catch (e) {}
                // Force cart count update by returning a new object
                return { ...validatedCart };
            }
            return prevCart;
        });
    };

    // 🔴 NEW: Logout Function
    const logout = async () => {
        try {
            const wasLoggedIn = Boolean(token);
            await signOut(auth); // Sign out from Firebase
            setToken('');
            localStorage.removeItem('token');
            // If the user was logged in, clear their local cart on logout
            if (wasLoggedIn) {
                setCartItems({});
                try { localStorage.removeItem('cartItems'); } catch (e) {}
            }
            // Restore previous behavior: redirect to last visited path (or homepage), not forced /login
            const redirectPath = localStorage.getItem('lastVisitedPath');
            const loginPaths = ['/login', '/newlogin', '/finish-login'];
            const target = redirectPath && !loginPaths.includes(redirectPath) ? redirectPath : '/';
            navigate(target);
        } catch (error) {
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            try {
                const val = cartItems[items];
                if (val == null) continue;
                if (typeof val === 'object') {
                    totalCount += Object.values(val).reduce((s, v) => s + (Number(v) || 0), 0);
                } else {
                    totalCount += Number(val) || 0;
                }
            } catch (error) {}
        }
        return totalCount;
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            try {
                if (!itemInfo) continue;
                const val = cartItems[items];
                let qty = 0;
                if (val == null) continue;
                if (typeof val === 'object') {
                    qty = Object.values(val).reduce((s, v) => s + (Number(v) || 0), 0);
                } else {
                    qty = Number(val) || 0;
                }
                if (qty > 0) {
                    totalAmount += itemInfo.price * qty;
                }
            } catch (error) {}
        }
        return totalAmount;
    };

    // Computed authoritative cart count (sum of quantities)
    const cartCount = useMemo(() => {
        let total = 0;
        for (const key in cartItems) {
            const val = cartItems[key];
            if (val == null) continue;
            if (typeof val === 'object') {
                total += Object.values(val).reduce((s, v) => s + (Number(v) || 0), 0);
            } else {
                total += Number(val) || 0;
            }
        }
        return total;
    }, [cartItems]);

    useEffect(() => {
        getProductsData();
        // Refresh products every 10 seconds to catch deleted items
        const interval = setInterval(getProductsData, 10000);
        return () => clearInterval(interval);
    }, []);

    // Validate cart whenever products change
    useEffect(() => {
        validateCart(products);
    }, [products]);

    // Persist cart for guests so refresh keeps items
    useEffect(() => {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (err) {
        }
    }, [cartItems]);

    // Listen to Firebase Auth State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const prevToken = localStorage.getItem('token');
                const freshMagicLogin = localStorage.getItem('freshMagicLogin') === '1';
                const freshToken = await user.getIdToken();
                setToken(freshToken);
                localStorage.setItem('token', freshToken);
                localStorage.setItem('userId', user.uid);
                // If there was no previous token stored, this is a fresh login — persist merged cart to server
                const persist = !prevToken && !freshMagicLogin;
                if (freshMagicLogin) {
                    localStorage.removeItem('freshMagicLogin');
                }
                await getUserCart(freshToken, persist);
            } else {
                setToken('');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                // Don't clear cart - keep guest cart items
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value = {
        products,
        currency,
        delivery_fee,
        setSearch,
        showSearch,
        search,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        cartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,
        token,
        setCartItems,
        loading,
        logout, // 🔴 Export logout function
        validateCart // Export cart validation function
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;