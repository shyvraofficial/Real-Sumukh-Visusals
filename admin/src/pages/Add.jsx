import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App'
import { NotificationContext } from '../context/NotificationContext';

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
    // P-4 for mobile, sm:p-8 for desktop. 
    // gap-4 ensures elements don't touch each other
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 p-4 sm:p-8'>
      
      {/* Images Section */}
      <div className='w-full'>
        <p className='mb-2 text-base font-medium text-gray-700'>Upload Image</p>
        <div className='flex gap-2 flex-wrap'>
           {[image1, image2, image3, image4].map((img, index) => (
             <label key={index} htmlFor={`image${index}`} className='cursor-pointer group'>
                {/* Fixed size containers that don't shrink */}
                 <div className='w-20 h-20 sm:w-24 sm:h-24 bg-white border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg hover:border-[#333] transition-colors overflow-hidden'>
                   <img className='w-full h-full object-cover' src={!img ? assets.upload_area : URL.createObjectURL(img)} alt="" />
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
      </div>

      {/* Name Input */}
      <div className='w-full sm:max-w-[500px]'>
        <p className='mb-2 text-base font-medium text-gray-700'>Product name</p>
        <input 
          onChange={(e) => setName(e.target.value)} 
          value={name} 
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#333] outline-none transition-colors' 
          type="text" 
          placeholder='Type here' 
          required 
        />
      </div>

      {/* Description Input */}
      <div className='w-full sm:max-w-[500px]'>
        <p className='mb-2 text-base font-medium text-gray-700'>Product description</p>
        <textarea 
          onChange={(e) => setDescription(e.target.value)} 
          value={description} 
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#333] outline-none min-h-[100px] transition-colors' 
          placeholder='Write content here' 
          required 
        />
      </div>

      {/* Download Link Input */}
      <div className='w-full sm:max-w-[500px]'>
        <p className='mb-2 text-base font-medium text-gray-700'>Drive Download Link (for digital products)</p>
        <input 
          onChange={(e) => setDownloadLink(e.target.value)} 
          value={downloadLink} 
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#333] outline-none transition-colors' 
          type="url" 
          placeholder='https://drive.google.com/...' 
        />
        <p className='text-xs text-gray-500 mt-1'>Leave empty if not a digital product</p>
      </div>

      {/* DEEP ANALYSE FIX:
         Using 'flex-col' for mobile (stacks items vertically)
         Using 'sm:flex-row' for desktop (puts them in a line)
      */}
      <div className='flex flex-col sm:flex-row gap-4 w-full sm:gap-8'>
        
        <div className='w-full'>
          <p className='mb-2 text-base font-medium text-gray-700'>Category</p>
          <select 
            onChange={(e) => setCategory(e.target.value)} 
            value={category} 
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#333] outline-none'
            required
          >
            <option value="">Select category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className='w-full'>
          <p className='mb-2 text-base font-medium text-gray-700'>Sub Category</p>
          <select 
            onChange={(e) => setSubCategory(e.target.value)} 
            value={subCategory} 
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#333] outline-none'
            required
          >
            <option value="">Select sub category</option>
            {subCategoryOptions.map((subCat) => (
              <option key={subCat} value={subCat}>{subCat}</option>
            ))}
          </select>
        </div>

        <div className='w-full sm:w-auto'>
          <p className='mb-2 text-base font-medium text-gray-700'>Price</p>
          <input 
            onChange={(e) => setPrice(e.target.value)} 
            value={price} 
            className='w-full sm:w-[150px] px-4 py-2 border border-gray-300 rounded-md focus:border-[#333] outline-none' 
            type="number" 
            placeholder="25" 
            required
          />
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className='flex gap-2 mt-2 items-center'>
        <input 
          onChange={() => setBestseller(prev => !prev)} 
          checked={bestseller} 
          type="checkbox" 
          id='bestseller' 
          className='w-5 h-5 accent-[#333]' 
        />
        <label className='cursor-pointer font-medium text-gray-700 text-base' htmlFor="bestseller">Add to bestseller</label>
      </div>

      {/* Submit Button - Full width on mobile, fixed on desktop */}
      <button type="submit" className='w-full sm:w-32 py-3 mt-2 bg-black text-white font-bold rounded-md hover:bg-[#333] transition-colors'>
        ADD
      </button>

    </form>
  )
}

export default Add;