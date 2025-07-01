import { Component } from '@angular/core';
import { CartPageComponent } from './Checkout-page/cart-page/cart-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CartPageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
