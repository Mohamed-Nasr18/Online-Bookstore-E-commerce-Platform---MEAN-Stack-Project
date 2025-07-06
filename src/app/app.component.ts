import { Component } from '@angular/core';
import { CartPageComponent } from './Checkout-page/cart-page/cart-page.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CartPageComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
