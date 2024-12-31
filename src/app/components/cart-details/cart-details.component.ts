import { Component } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent {


  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;



  constructor(private cartService: CartService
              ){}

  ngOnInit(){
    this.listCartDetails();
  }

  listCartDetails() {

    //get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    //subscribe to the cart TotalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

     //subscribe to the cart TotalQuantity
     this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );


    //compute cart totalPrice and total quantity
    this.cartService.computeCartTotals();


  }


  incrementQuantity(theCartItem: CartItem) {
   this.cartService.addInCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem) {
   this.cartService.decrementFromCart(theCartItem);
  }

  removeItem(theCartItem: CartItem) {
   this.cartService.remove(theCartItem);
  }
}
