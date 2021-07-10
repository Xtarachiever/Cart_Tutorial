import React, { useState,useEffect } from 'react'
import './App.css';
import {commerce} from './lib/commerce';
import {NavBar,Products,Cart,CheckOut} from './Components';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';

function App() {
  const [products,setProducts]=useState([]);
  const [cart,setCart] =useState({});
  const [order,setOrder]=useState({});
  const [errorMessage,setErrorMessage]=useState('');

  const fetchProducts=async () => {
    const {data} =await commerce.products.list();
    setProducts(data);
  }
  const fetchCart=async ()=>{
    const carts =await commerce.cart.retrieve();
    setCart(carts)
  }
  const handleCart=async (productId,quantity)=>{
    const cartItems=await commerce.cart.add(productId,quantity);
    setCart(cartItems.cart)
  }
  const handleUpdateCartQty= async (productId,quantity)=>{
    const {cart}= await commerce.cart.update(productId,{quantity});
    setCart(cart)
  }
  const handleRemoveFromCart = async (productId) =>{
    const {cart} =await commerce.cart.remove(productId);
    setCart(cart)
  }
  const handleEmptyCart=async()=>{
    const {cart}=await commerce.cart.empty();
    setCart(cart)
  }

  const refreshCart= async()=>{
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
  }

  const handleCaptureCheckOut= async(CheckOutTokenId,newOrder)=>{
    try{
      const incomingOrder= await commerce.checkout.capture(CheckOutTokenId,newOrder);
      setOrder(incomingOrder);
      refreshCart();
    }
    catch(error){
      setErrorMessage(error.data.error.message);
    }
  }
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);
  return (
    <Router>
      <div className="App">
        <NavBar totalItems={cart.total_items}/>
        <Switch>
          <Route exact path="/"><Products products={products} onAddToCart={handleCart}/></Route>
          <Route exact path="/cart"><Cart cart={cart} totalItems={cart.total_items}
          handleEmptyCart={handleEmptyCart} 
          handleRemoveFromCart={handleRemoveFromCart}
          handleUpdateCartQty={handleUpdateCartQty}/></Route>
          <Route exact path="/checkout">
              <CheckOut cart={cart}
              order={order}
              onCaptureCheckout={handleCaptureCheckOut}
              error={errorMessage} refreshCart={refreshCart}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
