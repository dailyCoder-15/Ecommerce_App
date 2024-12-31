package in.krloyar.ecommerce.controller;

import in.krloyar.ecommerce.dto.Purchase;
import in.krloyar.ecommerce.dto.PurchaseResponse;
import in.krloyar.ecommerce.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/checkout")
public class CheckoutController {

    private final CheckoutService cs;
    @Autowired
    CheckoutController(CheckoutService cs){
        this.cs = cs;
    }

    //endpoint: http://localhost:8080/checkout/hello
    @GetMapping("/hello")
    public String sayHello(){
        return "Hello, how may I help you";
    }

    //endpoint: http://localhost:8080/checkout/myName
    @PostMapping("/myName")
    public String myName(@RequestParam("myName") String name){

        return "Hello "+name+", how may I help you?";
    }

    //endpoint: http://localhost:8080/checkout/purchase
    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){
        return cs.placeOrder(purchase);
    }
}
