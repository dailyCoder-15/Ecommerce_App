package in.krloyar.ecommerce.service;

import in.krloyar.ecommerce.dto.Purchase;
import in.krloyar.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase thePurchase);
}
