import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
theme: 'light' | 'dark' = 'light';

  ngOnInit(): void {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    this.theme = 'dark';
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', function (e: KeyboardEvent) {
      if (e.key === 'Enter') {
        const target = e.target as HTMLInputElement;
        const query = target.value.trim();
        if (query) {
          console.log('Searching for:', query);
        }
      }
    });
  }
}

toggleTheme(): void {
  document.body.classList.toggle('dark-theme');
  this.theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  localStorage.setItem('theme', this.theme);
}
// theme: 'light' | 'dark' = 'light';

// toggleTheme(): void {
//   document.body.classList.toggle('dark-theme');
//   this.theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
// }

  // toggleTheme() {
  //           document.body.classList.toggle('dark-theme');
  //           const button = document.querySelector('.theme-toggle');
  //           button!.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
  //       }

        // Add search functionality

//         ngOnInit(): void {
//   const searchInput = document.getElementById('searchInput');
//   if (searchInput) {
//     searchInput.addEventListener('keypress', function (e: KeyboardEvent) {
//       if (e.key === 'Enter') {
//         const target = e.target as HTMLInputElement;
//         const query = target.value.trim();
//         if (query) {
//           console.log('Searching for:', query);
//           // Add your search logic here
//         }
//       }
//     });
//   }
// }

        // ngOnInit(): void {
        //   document.getElementById('searchInput').addEventListener('keypress', function(e) {
        //       if (e.key === 'Enter') {
        //           const query = this.value.trim();
        //           if (query) {
        //               console.log('Searching for:', query);
        //               // Add your search logic here
        //           }
        //       }
        //   });
        // }
  
}