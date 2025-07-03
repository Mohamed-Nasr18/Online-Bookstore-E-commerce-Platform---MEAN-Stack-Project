import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  price: number;
  image: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  books: Book[] = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      genre: "fiction",
      rating: 4.5,
      price: 14.99,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=edges"
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      genre: "self-help",
      rating: 4.8,
      price: 16.99,
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop&crop=edges"
    },
    {
      id: 3,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      genre: "mystery",
      rating: 4.3,
      price: 12.99,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=edges"
    },
    {
      id: 4,
      title: "Dune",
      author: "Frank Herbert",
      genre: "sci-fi",
      rating: 4.6,
      price: 18.99,
      image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop&crop=edges"
    },
    {
      id: 5,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      genre: "romance",
      rating: 4.7,
      price: 13.99,
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop&crop=edges"
    },
    {
      id: 6,
      title: "Educated",
      author: "Tara Westover",
      genre: "biography",
      rating: 4.4,
      price: 15.99,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=edges"
    },
    {
      id: 7,
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      genre: "fiction",
      rating: 4.2,
      price: 14.50,
      image: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=300&h=400&fit=crop&crop=edges"
    },
    {
      id: 8,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      genre: "finance",
      rating: 4.6,
      price: 17.99,
      image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=300&h=400&fit=crop&crop=edges"
    },
    {
      id: 9,
      title: "Project Hail Mary",
      author: "Andy Weir",
      genre: "sci-fi",
      rating: 4.8,
      price: 19.99,
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop&crop=edges"
    },
    {
      id: 10,
      title: "The Guest List",
      author: "Lucy Foley",
      genre: "mystery",
      rating: 4.1,
      price: 11.99,
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop&crop=edges"
    },
    {
      id: 11,
      title: "It Ends with Us",
      author: "Colleen Hoover",
      genre: "romance",
      rating: 4.3,
      price: 13.50,
      image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop&crop=edges"
    },
    {
      id: 12,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      genre: "history",
      rating: 4.5,
      price: 20.99,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=edges"
    }
  ];


  toggleView(viewType: string, event?: Event) {
            const container = document.getElementById('booksContainer');
            const viewBtns = document.querySelectorAll('.view-btn');
            
            viewBtns.forEach(btn => btn.classList.remove('active'));
            if (event && event.target && (event.target as HTMLElement).closest('.view-btn')) {
                ((event.target as HTMLElement).closest('.view-btn') as HTMLElement).classList.add('active');
            }
            
            if (container) {
                if (viewType === 'list') {
                    container.classList.add('list-view');
                    container.classList.remove('books-grid');
                } else {
                    container.classList.remove('list-view');
                    container.classList.add('books-grid');
                }
            }
        }

        // Add interactive functionality in ngOnInit
        ngOnInit(): void {
            // Filter buttons
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function(this: HTMLElement) {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            // Favorite buttons
            const favBtns = document.querySelectorAll('.btn-favorite');
            favBtns.forEach(btn => {
                btn.addEventListener('click', function(this: HTMLElement) {
                    this.classList.toggle('active');
                    const icon = this.querySelector('i');
                    if (icon) {
                        if (this.classList.contains('active')) {
                            icon.classList.remove('far');
                            icon.classList.add('fas');
                        } else {
                            icon.classList.remove('fas');
                            icon.classList.add('far');
                        }
                    }
                });
            });
                        // Favorite buttons
            const cartBtns = document.querySelectorAll('.btn-cart');
            cartBtns.forEach(btn => {
                btn.addEventListener('click', function(this: HTMLElement) {
                    this.classList.toggle('active');
                    const icon = this.querySelector('i');
                    if (icon) {
                        if (this.classList.contains('active')) {
                            icon.classList.remove('far');
                            icon.classList.add('fas');
                        } else {
                            icon.classList.remove('fas');
                            icon.classList.add('far');
                        }
                    }
                });
            });

            // Search functionality
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.addEventListener('input', function(this: HTMLInputElement) {
                    // Add search logic here
                    console.log('Searching for:', this.value);
                });
            }

            // View buttons
            const viewBtns = document.querySelectorAll('.view-btn');
            viewBtns.forEach(btn => {
                btn.addEventListener('click', function(this: HTMLElement) {
                    viewBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        }
}
