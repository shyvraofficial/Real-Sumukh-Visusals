import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { NotificationContext } from '../context/NotificationContext'
import { Badge } from '../components/UIComponents'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const { error: showError, success } = useContext(NotificationContext);
  
  const fetchList = async() => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`)
      if(response.data.success) {
        setList(response.data.products)
      } else {
        showError(response.data.message || 'Unable to load products')
      }
    } catch (error) {
      showError('Unable to load products')
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        success(response.data.message || 'Product removed successfully');
        await fetchList();
      } else {
        showError(response.data.message || 'Unable to remove product');
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Unable to remove product');
    }
  };

  const filteredList = list.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(list.map(item => item.category))];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-white mb-2">Products Library</h1>
        <p className="text-gray-400">Total Products: {list.length}</p>
      </div>

      {/* Filters */}
      <div className="border border-gray-700 rounded-lg p-6 mb-8" style={{ backgroundColor: '#131313' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Search Products</label>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Filter by Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gray-500 transition-colors appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%9ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem',
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <p className="text-gray-400 text-sm mb-6">
        Showing {filteredList.length} of {list.length} products
      </p>

      {/* Products Grid */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredList.map((item, index) => (
            <div key={index} className="border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors" style={{ backgroundColor: '#131313' }}>
              {/* Product Image */}
              <div className="w-full h-48 bg-gray-700 overflow-hidden">
                {item.images && item.images[0] && (
                  <img 
                    src={item.images[0].url} 
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <h3 className="text-lg font-medium text-white flex-1">{item.name}</h3>
                  {item.bestseller && (
                    <Badge variant="warning" className="whitespace-nowrap">★ Bestseller</Badge>
                  )}
                </div>

                <div className="flex gap-2 mb-4">
                  <Badge variant="default">{item.category}</Badge>
                  {item.subCategory && (
                    <Badge variant="default">{item.subCategory}</Badge>
                  )}
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-light text-white">
                    {currency}{item.price}
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this product?')) {
                        removeProduct(item._id);
                      }
                    }}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-gray-700 rounded-lg p-12 text-center" style={{ backgroundColor: '#131313' }}>
          <p className="text-gray-400 text-lg">No products found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

export default List;
