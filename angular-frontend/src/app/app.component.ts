import { Component } from '@angular/core';
// Import RouterOutlet and RouterLink for standalone component routing
import { RouterOutlet, RouterLink } from '@angular/router';
// You might not need to import CartPageComponent and FileManagerComponent here
// unless you are directly embedding them and not using routing.
// For routing, they are imported in app.routes.ts
// import { CartPageComponent } from './Checkout-page/cart-page/cart-page.component';
// import { FileManagerComponent } from './file-manager/file-manager.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Add RouterOutlet and RouterLink to the imports array for standalone components
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public title = 'Book-Store';
}