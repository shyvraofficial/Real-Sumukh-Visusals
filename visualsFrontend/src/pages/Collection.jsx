import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShopContext } from '../context/ShopContext'
import ProductItems from '../components/ProductItems'
import { assets } from '../assets/assets'
import './Collection.css'


const Collection = () => {
  const { products, search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const [expandedFilters, setExpandedFilters] = useState({ category: true, type: true })

  console.log('Products from context:', products)
  console.log('FilterProducts state:', filterProducts)

  useEffect(() => {
    if (products && products.length > 0) {
      setFilterProducts(products)
    }
  }, [products])

  useEffect(() => {
    applyFilter()
  }, [category, subCategory, search, showSearch])

  useEffect(() => {
    sortProduct()
  }, [sortType])

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products && products.length > 0 ? products.slice() : []

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => {
        const itemCategories = Array.isArray(item.categories) ? item.categories : [item.category]
        return category.some(cat => itemCategories.includes(cat))
      })
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => {
        const itemSubCategories = Array.isArray(item.subCategories) ? item.subCategories : [item.subCategory]
        return subCategory.some(subCat => itemSubCategories.includes(subCat))
      })
    }
    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice()
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price))
        break
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price))
        break
      default:
        applyFilter()
        break
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div className="collection-page">
      {/* Hero Section */}
      <motion.div
        className="collection-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <h1>Explore Now</h1>
          <p>Discover our curated selection of premium products</p>
        </div>
      </motion.div>

      {/* Search Bar */}
      {showSearch && (
        <div className="collection-search">
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                value={search} 
                name="search"
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
                type="text"
                placeholder="Search"
              />
              <img className="search-icon !h-[1rem] !w-[rem]" src={assets.search_icon} alt="search" />
            </div>
            <img
              onClick={() => setShowSearch(false)}
              className="search-close"
              src={assets.cross_icon}
              alt="close"
            />
          </div>
        </div>
      )}

      <div className="collection-main">
        {/* Sidebar */}
        <motion.aside
          className="collection-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button
              className="close-filters"
              onClick={() => setShowFilter(!showFilter)}
            >
              <img 
                src={showFilter ? assets.cross_icon : assets.dropdown_icon} 
                alt="toggle filters"
                className="filter-toggle-icon"
              />
            </button>
          </div>

          <div className={`filter-section ${showFilter ? 'active' : ''}`}>
            <div className="filter-group">
              <div className="filter-header" onClick={() => setExpandedFilters({...expandedFilters, category: !expandedFilters.category})}>
                <h4>Category</h4>
                <img 
                  src={assets.dropdown_icon} 
                  alt="expand" 
                  className={`dropdown-icon ${expandedFilters.category ? 'expanded' : ''}`}
                />
              </div>
              {expandedFilters.category && (
                <div className="checkbox-group">
                  {['Assets', 'Packs', 'Free', 'Support'].map(cat => (
                    <label key={cat} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={cat}
                        onChange={toggleCategory}
                        checked={category.includes(cat)}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-group">
              <div className="filter-header" onClick={() => setExpandedFilters({...expandedFilters, type: !expandedFilters.type})}>
                <h4>Type</h4>
                <img 
                  src={assets.dropdown_icon} 
                  alt="expand" 
                  className={`dropdown-icon ${expandedFilters.type ? 'expanded' : ''}`}
                />
              </div>
              {expandedFilters.type && (
                <div className="checkbox-group">
                  {['Sound Effects', 'Overlays and Transitions', 'Text Animation and MOGRTs'].map(type => (
                    <label key={type} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={type}
                        onChange={toggleSubCategory}
                        checked={subCategory.includes(type)}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {(category.length > 0 || subCategory.length > 0) && (
              <button
                className="btn-clear-filters"
                onClick={() => {
                  setCategory([])
                  setSubCategory([])
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </motion.aside>

        {/* Products Section */}
        <div className="collection-content">
          {/* Controls */}
          <div className="content-header">
            <h3 className="collection-subheading">Curated Catalog</h3>
            <div className="sort-wrapper">
              <label htmlFor="sort-select">Sort:</label>
              <select
                id="sort-select"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="sort-select"
              >
                <option value="relevant">Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filterProducts && filterProducts.length > 0 ? (
            <div className="products-grid">
              {filterProducts.map((item) => (
                <div
                  key={item._id}
                  className="product-card"
                >
                  <ProductItems
                    name={item.name}
                    id={item._id}
                    price={item.price}
                    image={item.images}
                  />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="products-grid">
              {products.map((item) => (
                <div
                  key={item._id}
                  className="product-card"
                >
                  <ProductItems
                    name={item.name}
                    id={item._id}
                    price={item.price}
                    image={item.images}
                  />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>No products found - Loading from server...</p>
              <button
                className="btn-reset"
                onClick={() => {
                  setCategory([])
                  setSubCategory([])
                }}
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Collection
