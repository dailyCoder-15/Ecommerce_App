import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);


  addInCart(theCartItem: CartItem){

    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;


    if(this.cartItems.length > 0){
      //find the items in the cart based on item id

      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id === theCartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }

      //check if we found it
      alreadyExistsInCart = (existingCartItem != undefined)
    }

      if(alreadyExistsInCart){
        //increment quantity
        existingCartItem.quantity++;
      }else {
        //just add the item in the array
        this.cartItems.push(theCartItem);
      }

      //compute cart quantity and cart total
      this.computeCartTotals();

  }


  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values ...all subscribers will recieve the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  decrementFromCart(theCartItem: CartItem){
    theCartItem.quantity--;
    if(theCartItem.quantity === 0){
      //remove from the cart
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }
  
  remove(theCartItem: CartItem) {
    //get Index of item in the array
    const itemIndex = this.cartItems.findIndex(
      tempCartItem => tempCartItem.id == theCartItem.id
    );

    //if found, remove the item
    this.cartItems.splice(itemIndex, 1);

    this.computeCartTotals();
  }


}//CartService Class Ends Here


