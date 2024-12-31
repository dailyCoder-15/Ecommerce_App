import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  constructor(private router: Router){}

  searchProduct(keyword: string){
    console.log(`Search will happenin a moment: ${keyword}`);
    this.router.navigateByUrl(`/search/${keyword}`);
  }
}
