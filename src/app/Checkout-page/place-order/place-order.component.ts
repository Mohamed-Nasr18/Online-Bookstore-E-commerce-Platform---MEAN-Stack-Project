import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent {
  @Input() cartItems: any[] = [];

  get totalMRP() {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  get discount() {
    return 20;
  }

  get estimatedTax() {
    return 15;
  }

  get total() {
    return this.totalMRP - this.discount + this.estimatedTax;
  }
}
