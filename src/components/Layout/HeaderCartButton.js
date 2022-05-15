import React, { useContext, useEffect, useState } from 'react';
import CartContext from '../../store/cart-context';

import CartIcon from '../Cart/CartIcon';
import classes from './HeaderCartButton.module.css';

const HeaderCartButton = (props) => {
    const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);

    // this will be used for item count that is badge count
    const cartCtx = useContext(CartContext);
    const { items } = cartCtx;

    const numberOfCartItems = items.reduce((cartNumber, item) => {
        return cartNumber + item.amount;
    }, 0);

    const buttonClasses = `${classes.button} ${btnIsHighlighted ? classes.bump : ''}`

    // using useEffect() to play button animation 
    useEffect(() => {
        if (items.length === 0) {
            return;
        }
        setBtnIsHighlighted(true);

        // remove bump class after animation is finished using settimeout        
        const timer = setTimeout(() => {
            setBtnIsHighlighted(false); 
        }, 300);

        // clean up fn for timer
        return () => {
            clearTimeout(timer);
        }
    }, [items]);

    return (
        // here onClick is passed forward from app => header => header cart button to button
        // a long prop chain, we can replace it with Context , another possible way.
        <button className={buttonClasses} onClick={props.onClick}>
            <span className={classes.icon}>
                <CartIcon />
            </span>
            <span>
                Your Cart
            </span>
            <span className={classes.badge}>
                { numberOfCartItems }
            </span>
        </button>
    )
};

export default HeaderCartButton;