import React from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { NotificationContext } from '../context/NotificationContext'
import { useState, useEffect, useContext } from 'react'

const List = () => {
  const [list, setList] = useState([])
  const { error: showError, success } = useContext(NotificationContext);
  
  const fetchList = async()=>{
    try{
      const response = await axios.get(`${backendUrl}/api/product/list`)
      if(response.data.success){
        setList(response.data.products)
      }
      else{
        showError(response.data.message || 'Unable to load products')
      }
    }
    catch (error){
      console.error(error)
      showError('Unable to load products')
    }
  }

  useEffect(()=>{
    fetchList()
  }, [])

  console.log("Fetched Products:", list) 

  const removeProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Authentication token not found');
        return;
      }
  
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
      console.error(error);
      showError(error.response?.data?.message || 'Unable to remove product');
    }
  };

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/*List Table Title */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* Product List */}
        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12' src={item.images?.[0]?.url || 'default-image-url'} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p onClick={()=> removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default List;
