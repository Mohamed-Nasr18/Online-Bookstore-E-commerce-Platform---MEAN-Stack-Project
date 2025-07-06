import { Routes } from '@angular/router';
import { ProductDetialsComponent } from './product-detials/product-detials.component';
// import { PlaceOrderComponent } from './Checkout-page/place-order/place-order.component';
// import { ShoppingCartComponent } from './Checkout-page/shopping-cart/shopping-cart.component';
import { CartPageComponent } from './Checkout-page/cart-page/cart-page.component';

export const routes: Routes = [
  { path: '', component: ProductDetialsComponent },
  // { path: 'place-order', component: PlaceOrderComponent },
  // { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'cart-page', component: CartPageComponent },
  { path: '**', redirectTo: 'product-detials' },
];
