import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';
import pendingCartModel from '../models/pendingCartModel.js';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, downloadLink } = req.body;

        // ✅ Ensure req.files exists
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded" });
        }

        // ✅ Extract images safely 🤡
        const image1 = req.files.image1?.[0];
        const image2 = req.files.image2?.[0];
        const image3 = req.files.image3?.[0];
        const image4 = req.files.image4?.[0];
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images to Cloudinary
        const now = new Date();
        const dateString = now.toISOString().replace(/[:.]/g, '-');
        let imagesUrl = await Promise.all(
            images.map(async (item, idx) => {
                // Create a custom public_id for easier identification
                const customPublicId = `product_${name.replace(/\s+/g, '_')}_${dateString}_${idx+1}`;
                let result = await cloudinary.uploader.upload(item.path, {
                    resource_type: 'image',
                    public_id: customPublicId
                });
                return {
                    url: result.secure_url,
                    public_id: result.public_id
                };
            })
        );


        // ✅ Create product data object
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true" ? true:false,
            downloadLink: downloadLink || '',
            images: imagesUrl,
            date: Date.now(),
        };

        // ✅ Save product in DB
        const product = new productModel(productData);
        await product.save();
        res.json({ success: true, message: "Product Added" });

    }
    catch (error){
        console.log(error);
        res.json({success:false, message: error.message})
    }
}

// function for list product
const listProducts = async (req, res) => {
    try{
        const products = await productModel.find({});
        res.json({success:true, products})
    }
    catch (error){
        console.log(error);
        res.json({success:false, message: error.message})
    }
}


    // function for remove product
    const removeProduct = async (req, res) => {
        try {
            const productId = req.body.id;
            const product = await productModel.findById(productId);
            if (!product) {
                return res.json({ success: false, message: "Product not found" });
            }

            // Delete all cloudinary images except the one used for downloadLink
            let downloadPublicId = null;
            let dateString = product.date ? new Date(product.date).toISOString().replace(/[:.]/g, '-') : null;
            if (product.downloadLink) {
                const match = product.images.find(img => img.url === product.downloadLink);
                if (match) {
                    downloadPublicId = match.public_id;
                }
            }
            await Promise.all(
                product.images
                    .filter(img => {
                        // Do not delete if public_id matches downloadPublicId or contains the product date
                        if (img.public_id === downloadPublicId) return false;
                        if (dateString && img.public_id.includes(dateString)) return false;
                        return true;
                    })
                    .map(img => cloudinary.uploader.destroy(img.public_id))
            );

            // Remove product from all user carts
            const users = await userModel.find({});
            for (let user of users) {
                if (user.cartData && user.cartData[productId]) {
                    delete user.cartData[productId];
                    await user.save();
                }
            }

            // Remove product from all pending (guest) carts
            await pendingCartModel.updateMany(
                { ["cartData." + productId]: { $exists: true } },
                { $unset: { ["cartData." + productId]: "" } }
            );

            // Delete the product record
            await productModel.findByIdAndDelete(productId);

            res.json({ success: true, message: "Product removed & images deleted" });
        }
        catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }
    
// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId)
        res.json({success: true, product})
    }
    catch (error){
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

// Get download link (only for verified buyers)
const getDownloadLink = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;

        // Get the product
        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        
        if (!product.downloadLink) {
            return res.json({ success: false, message: "Download not available for this product" });
        }

        // Import orderModel to verify purchase
        const orderModel = (await import('../models/orderModel.js')).default;
        
        // Check if user has purchased this product
        const order = await orderModel.findOne({
            userId: userId,
            'items._id': productId
        });

        if (!order) {
            return res.status(403).json({ success: false, message: "You haven't purchased this product" });
        }
        res.json({ success: true, downloadLink: product.downloadLink });
    }
    catch (error) {
        console.log('Download error:', error);
        res.json({ success: false, message: error.message });
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, getDownloadLink }