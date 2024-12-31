
import { Component } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { FormService } from '../../services/form.service';
import { Country } from '../../common/country';
import { State } from './../../common/state';
import { Purchase } from '../../common/purchase';
import { CheckoutService } from '../../services/checkout.service';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent{

  checkoutFormGroup!: FormGroup;
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];
  shippingAddressStates : State[] = [];
  billingAddressStates : State[] = [];

  // listReviewDetails(){

  //    //subscribe to the cart TotalPrice
  //    this.cartService.totalPrice.subscribe(
  //     data => this.totalPrice = data
  //   );

  //    //subscribe to the cart TotalQuantity
  //    this.cartService.totalQuantity.subscribe(
  //     data => this.totalQuantity = data
  //   );

  //   this.cartService.computeCartTotals();
  // }

  getStates(formGroupName: string){

    const formGroup = this.checkoutFormGroup.get(formGroupName)!;
    const countryCode = formGroup?.value.country.code;

    this.formService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates=data
        }
        else{
          this.billingAddressStates = data;
        }

        //select first item by default
        // formGroup.get('state')?.setValue(data[0]);
      }
    );
  }

  getCountries(formGroupName: string){

    const formGroup = this.checkoutFormGroup.get(formGroupName)!;
    const stateCode = formGroup?.value.state.code;

    this.formService.getCountries().subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates=data
        }
        else{
          this.billingAddressStates = data;
        }


        //select first item by default
        formGroup.get('country')?.setValue(data[0]);
      }
    );
  }

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private formService: FormService,
              private checkoutService: CheckoutService
  ){}

  ngOnInit(): void {

    //populate countries
    this.formService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );

    this.checkoutFormGroup = this.formBuilder.group({

      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName:  new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._-]+@[a-z0-9,-]+\\.[a-z]{2,4}$')])
      }),

      shippingAddress: this.formBuilder.group({
        country: [''],
        street: new FormControl('', [Validators.required, Validators.minLength(3)]),
        city: new FormControl('', [Validators.required, Validators.minLength(3)]),
        state: [''],
        zipCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')]),
      }),

      billingAddress: this.formBuilder.group({
        country: [''],
        street: new FormControl('', [Validators.required, Validators.minLength(2)]),
        city: new FormControl('', [Validators.required, Validators.minLength(2)]),
        state: [''],
        zipCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')])
      }),

      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(3)]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
        expMonth: [''],
        expYear: ['']
      }),

      reviewOrder: this.formBuilder.group({
        yourQuantity:  [''],
        shipping: [''],
        yourPrice: ['']
      })
    });

    //subscribe total price and total quantity

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: "+startMonth);
    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
        // console.log(`Retrieved credit card months: ${data}`);
      }
    );

    //populate credit card years
    this.formService.getCreditCardYears().subscribe(
      data => {
        // console.log(`Retrieved credit card years: ${data}`);
        this.creditCardYears = data;

      }
    );

    //subscribe to the cart TotalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

     //subscribe to the cart TotalQuantity
     this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

  }//ngOnInit ends here

  copyShippindToBilling(event: any) {
    // todo
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress']
                .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)

      //to fix bug
      this.billingAddressStates = this.shippingAddressStates;

    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  handleMonthsAndYears(){

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard')!;

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expYear);

    //if current year equals selected year start with current month
    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
        console.log(JSON.stringify("Month : "+data));

      }
    );
  }

  //Getter methods
  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }

  // get country(){
  //   return this.checkoutFormGroup.get('shippingAddress.country');
  // }

  // get state(){
  //   return this.checkoutFormGroup.get('shippingAddress.state');
  // }

  //Shipping Address Form Group Getters
  get street(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get city(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get zipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }



  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('creditCard')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);

    //Saving order steps:

    //Setup Order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //Get Cart Items
    const cartItems = this.cartService.cartItems;

    //Create orderItems from cartItems
    let orderItems: OrderItem[] = [];
    for(let i = 0; i < cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    let orderItemsInShort = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //Setup Purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;

    const shippingAddressState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));

    purchase.shippingAddress.state = shippingAddressState.name;
    purchase.shippingAddress.country = shippingAddressCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;

    const billingAddressState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));

    purchase.billingAddress.state = billingAddressState.name;
    purchase.billingAddress.country = billingAddressCountry.name;

    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItemsInShort;

    //Call ReST API: 'http://localhost:8080/checkout/purchase' via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response=>{
          alert(`Your order has been recieved.\nOrder Tracking Number: ${response.orderTrackingNumber}`);
        },
        error:err => {
          alert(`There is an error: ${err.message}`)
        }
      }
    );
  }
}
