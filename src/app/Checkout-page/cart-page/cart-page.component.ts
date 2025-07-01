import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { PlaceOrderComponent } from '../place-order/place-order.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, ShoppingCartComponent, PlaceOrderComponent],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent {
  cartItems = [
    {
      title: 'abc',
      price: 180,
      quantity: 9,
      image: 'assets/book1.jpg'
    },
    {
      title: 'efg',
      price: 250,
      quantity: 2,
      image: 'assets/book2.jpg'
    },
    {
      title: 'hkl',
      price: 399,
      quantity: 15,
      image: 'assets/book3.jpg'
    }
  ];
}
