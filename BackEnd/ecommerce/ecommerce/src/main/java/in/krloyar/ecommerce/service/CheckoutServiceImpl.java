package in.krloyar.ecommerce.service;

import in.krloyar.ecommerce.dto.Purchase;
import in.krloyar.ecommerce.dto.PurchaseResponse;
import in.krloyar.ecommerce.entity.Customer;
import in.krloyar.ecommerce.entity.Order;
import in.krloyar.ecommerce.entity.OrderItem;
import in.krloyar.ecommerce.restapi.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase){

        //retrieve the order info from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();

        //populate order with order items
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        //populate order with billing and shipping Address
        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());

        //populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        //save to the database
        customerRepository.save(customer);

        //return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber(){
        //generate a random UUID number(UUID version - 4)
        return UUID.randomUUID().toString();
    }
}
