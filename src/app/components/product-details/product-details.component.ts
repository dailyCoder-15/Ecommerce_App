import { Component } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

  cartItems: CartItem[] = [];

  theProduct: Product | undefined;

  constructor(private ps: ProductService,
              private route: ActivatedRoute,
              private cs: CartService){}

  ngOnInit(){
    this.route.paramMap.subscribe(() => {
      this.getProduct();
    });
  }

  getProduct(){
    const productId: number = +this.route.snapshot.paramMap.get('id')!;
    this.ps.getProduct(productId).subscribe(
      data => {
        console.log(data);
        this.theProduct = data;
      }
    );
  }

  addToCart(theProduct: Product) {

    const theCartItem = new CartItem(theProduct);

    //TODO: do the real work
    this.cs.addInCart(theCartItem);
  }
}
