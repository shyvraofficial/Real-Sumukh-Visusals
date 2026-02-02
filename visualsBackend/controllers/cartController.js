import userModel from "../models/userModel.js";
import pendingCartModel from "../models/pendingCartModel.js";

// Helper to ensure user exists
const getOrCreateUser = async (userId, email) => {
    let user = await userModel.findById(userId);
    if (!user) {
        // Create user with Firebase UID as _id
        user = await userModel.create({
            _id: userId,
            email: email,
            name: email.split('@')[0],
            cartData: {}
        });
    }
    return user;
};

const addToCart = async (req, res) => {
    try {
        const { userId, userEmail, itemId, quantity = 1 } = req.body;

        await getOrCreateUser(userId, userEmail); // Ensure user exists
        const userData = await userModel.findById(userId);

        let cartData = userData.cartData || {};

        const existing = Number(cartData[itemId]) || 0;
        cartData[itemId] = existing + Number(quantity);

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added To Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateCart = async (req, res) => {
    try {
        const { userId, userEmail, itemId, quantity } = req.body;

        await getOrCreateUser(userId, userEmail); // Ensure user exists
        const userData = await userModel.findById(userId);

        let cartData = userData.cartData || {};
        cartData[itemId] = Number(quantity) || 0;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getUserCart = async (req, res) => {
    try {
        const { userId, userEmail } = req.body;

        const userData = await getOrCreateUser(userId, userEmail); // Ensure user exists
        let cartData = userData.cartData || {};

        // Ensure values are numbers (flatten any legacy nested shapes)
        const normalized = {};
        Object.entries(cartData).forEach(([itemId, value]) => {
            if (value == null) return;
            if (typeof value === 'object') {
                const sum = Object.values(value).reduce((s, v) => s + (Number(v) || 0), 0);
                normalized[itemId] = sum;
            } else {
                normalized[itemId] = Number(value) || 0;
            }
        });

        res.json({ success: true, cartData: normalized });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const mergePendingCart = async (req, res) => {
    try {
        const { userId, userEmail, email } = req.body;
        const lookupEmail = String(email || userEmail || '').toLowerCase().trim();

        const userData = await getOrCreateUser(userId, userEmail);
        if (!lookupEmail) {
            return res.json({ success: true, cartData: userData.cartData || {} });
        }
        const pending = await pendingCartModel.findById(lookupEmail);

        if (!pending || !pending.cartData) {
            return res.json({ success: true, cartData: userData.cartData || {} });
        }

        const existing = userData.cartData || {};
        const merged = { ...existing };

        Object.entries(pending.cartData).forEach(([itemId, value]) => {
            const qty = Number(value) || 0;
            if (!merged[itemId]) merged[itemId] = qty;
            else merged[itemId] = (Number(merged[itemId]) || 0) + qty;
        });

        await userModel.findByIdAndUpdate(userId, { cartData: merged });
        await pendingCartModel.findByIdAndDelete(lookupEmail);

        return res.json({ success: true, cartData: merged });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart, mergePendingCart };