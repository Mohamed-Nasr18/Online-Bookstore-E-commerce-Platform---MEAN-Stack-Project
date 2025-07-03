import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { SideBarComponent } from './shared/side-bar/side-bar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SwiperComponent } from './swiper/swiper.component';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
    {path:"", component: HomeComponent},
    {path:"home", component: HomeComponent},
    {path:"category", component: CategoryComponent},
        
    {path:"swip", component: SwiperComponent},
    {path:"products", component: ProductsComponent},



];
