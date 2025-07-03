import { Component } from '@angular/core';
import { CategoryComponent } from '../category/category.component';
import { SideBarComponent } from '../shared/side-bar/side-bar.component';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SideBarComponent, ProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
