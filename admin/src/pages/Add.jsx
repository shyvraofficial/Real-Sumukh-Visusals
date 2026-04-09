import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App'
import { NotificationContext } from '../context/NotificationContext';
import { Button, FormInput, FormSelect, FormTextarea, Card } from '../components/UIComponents';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false)
  const { success, error: showError } = useContext(NotificationContext);

  const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB per image

  const categoryOptions = ["Assets", "Packs", "Free", "Support"]
  const subCategoryOptions = ["Sound Effects", "Overlays and Transitions", "Text Animation and MOGRTs"]

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Prevent sending too large payloads to the server (Vercel limit)
    const files = [image1, image2, image3, image4].filter(Boolean);
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const MAX_TOTAL_SIZE = 4 * 1024 * 1024; // 4MB combined

    if (totalSize > MAX_TOTAL_SIZE) {
      showError('Total image size is too large. Please keep all images under 4MB combined.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("downloadLink", downloadLink)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("sizes", JSON.stringify([]))
      formData.append("bestseller", bestseller)

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, { headers: { Authorization: `Bearer ${token}` } });
      
      if (response.data.success) {
        success('Product added successfully')
        setName(''); setDescription(''); setPrice(''); setDownloadLink('');
        setCategory(''); setSubCategory('');
        setImage1(false); setImage2(false); setImage3(false); setImage4(false);
      } else {
        showError(response.data.message || 'Unable to add product')
      }
    } catch (error) {
      showError('Unable to add product. Please try again')
    }
  }

  return (
    <div className="p-8">
      <form onSubmit={onSubmitHandler}>
        
        {/* Images Section */}
        <Card className="mb-8">
          <h2 className="text-xl font-light text-white mb-6">Product Images</h2>
          <p className="text-gray-400 text-sm mb-4">Upload up to 4 images (max 3MB each)</p>
          <div className='flex gap-4 flex-wrap'>
            {[image1, image2, image3, image4].map((img, index) => (
              <label key={index} htmlFor={`image${index}`} className='cursor-pointer group'>
                <div className='w-28 h-28 bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center rounded-lg hover:border-gray-500 transition-colors overflow-hidden group-hover:bg-gray-650'>
                  {!img ? (
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Image {index + 1}</p>
                    </div>
                  ) : (
                    <img className='w-full h-full object-cover' src={URL.createObjectURL(img)} alt="" />
                  )}
                </div>
                <input
                  type="file"
                  id={`image${index}`}
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    if (file.size > MAX_IMAGE_SIZE) {
                      showError(`Please upload images under 3MB. Selected file is ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
                      e.target.value = '';
                      return;
                    }
                    [setImage1, setImage2, setImage3, setImage4][index](file);
                  }}
                />
              </label>
            ))}
          </div>
        </Card>

        {/* Product Details Section */}
        <Card className="mb-8">
          <h2 className="text-xl font-light text-white mb-6">Product Details</h2>
          
          <FormInput
            label="Product Name"
            placeholder="e.g., Cinematic Transition Pack"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <FormTextarea
            label="Product Description"
            placeholder="Describe the product features and details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
          />

          <FormInput
            label="Download Link (Optional)"
            placeholder="https://drive.google.com/..."
            type="url"
            value={downloadLink}
            onChange={(e) => setDownloadLink(e.target.value)}
          />
        </Card>

        {/* Classification Section */}
        <Card className="mb-8">
          <h2 className="text-xl font-light text-white mb-6">Classification</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <FormSelect
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={categoryOptions}
                required
              />
            </div>
            <div>
              <FormSelect
                label="Sub Category"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                options={subCategoryOptions}
                required
              />
            </div>
          </div>
        </Card>

        {/* Pricing Section */}
        <Card className="mb-8">
          <h2 className="text-xl font-light text-white mb-6">Pricing & Status</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormInput
              label="Price (₹)"
              placeholder="e.g., 999"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  onChange={() => setBestseller(prev => !prev)} 
                  checked={bestseller} 
                  type="checkbox" 
                  className='w-5 h-5 rounded accent-white' 
                />
                <span className='text-gray-300 font-medium'>Mark as Bestseller</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button type="submit" variant="primary" size="lg">
            Add Product
          </Button>
          <Button type="reset" variant="secondary" size="lg">
            Clear Form
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Add;