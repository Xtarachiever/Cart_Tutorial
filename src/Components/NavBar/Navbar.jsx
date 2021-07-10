import React from 'react';
import {Link,useLocation} from 'react-router-dom';

import { CardActions,IconButton,Card,AppBar,Toolbar,Typography,Badge } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import useStyles from './styles';

const NavBar=({totalItems})=>{
    const classes=useStyles();
    const location = useLocation();
        return(
            <>
                <AppBar position="fixed" className={classes.appBar} color="inherit">
                    <Toolbar>
                        <Typography variant="h6" component={Link} to="/" className={classes.title} color="inherit">
                            OCTAVE <sub>cooperations</sub>
                        </Typography>
                        <div className={classes.grow}/>
                        {
                            location.pathname==="/" && (
                        <div className={classes.button}>
                            <IconButton component={Link} to="/cart" aria-label="Show Cart Items" color="inherit">
                                <Badge badgeContent={totalItems} color="secondary">
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>
                        </div>
                            )}
                    </Toolbar>
                </AppBar>
            </>
        )
};

export default NavBar;