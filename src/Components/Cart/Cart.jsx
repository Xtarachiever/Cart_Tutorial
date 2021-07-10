import { Container,Typography,Button,Grid } from "@material-ui/core";
import useStyles from './styles';
import CartItem from "./CartItem/CartItem";
import {Link} from 'react-router-dom';


const Cart = ({cart,handleRemoveFromCart,handleEmptyCart,handleUpdateCartQty}) => {
    const classes=useStyles();

    // const isEmpty=!cart.totalItems.length
    const EmptyCart=()=>(
            <Typography>You have no Item in your Cart
                <Link to="/" className={classes.link}> Start Shopping</Link>
            </Typography>
    )
    const FilledCart=()=>(
        <>
            <Grid container spacing={3}>
                {
                    cart.line_items.map((item)=>(
                        <Grid item xs={12} sm={4} key={item.id}>
                           <CartItem item={item} 
                           handleRemoveFromCart={handleRemoveFromCart}
                           handleUpdateCartQty={handleUpdateCartQty}/>
                        </Grid>
                    ))
                }
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h5">
                    Subtotal:{cart.subtotal.formatted_with_symbol}
                </Typography>
                <div>
                <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Empty Cart</Button>
                <Button className={classes.FilledCart} component={Link} to="/checkout" size="large" type="button" variant="contained" color="primary">Check Out</Button>
                </div>
            </div>
        </>
    )
    if(!cart.line_items) return 'Loading...'
    return (
        <Container>
            <div className={classes.toolbar}/>
            <Typography className={classes.title} variant="h3" gutterBottom>Your Shopping Cart</Typography>
            {!cart.line_items.length ? <EmptyCart /> : <FilledCart />}
        </Container>

    )
}

export default Cart;

