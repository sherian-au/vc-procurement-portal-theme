import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
//import { merge } from 'rxjs/observable/merge';
//import { of as observableOf } from 'rxjs/observable/of';
//import { map } from 'rxjs/operators';
import { tap, catchError, map, startWith, switchMap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Product } from '../models/product';
import { CategorySearch } from '../models/category';
//import { IProductSearch, ICatalogSearch } from '../models/ProductSearch';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
//@Injectable()
export class CatalogService {
  private fakeCategoriesUrl = 'api/categories';
  private fakeProductsUrl = 'api/products';  // URL to web api
  private catalogSearch = 'storefrontapi/catalog/search';  // URL to web api


  //dataSearch: CatalogSearch[] = [];
  isLoadingResults = true;
  data: ProductSearch[];

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getAllProducts() {
    //const url = window.location.origin;
    const body = { keyword: "", start: "0", isFuzzySearch: true, pageSize: "1000" };
    const url = window["BASE_URL"] + 'storefrontapi/catalog/search';
    return this.http.post<CatalogSearch>(url, body);
  }

  getAllCategories() {
    const body = { keyword: "", start: "0", isFuzzySearch: true, pageSize: "1000" };
    const url = window["BASE_URL"] + 'storefrontapi/categories/search';
    return this.http.post<CategorySearch>(url, body);
  }

  getFakeProducts() {
    return this.http.get(this.fakeProductsUrl).pipe(
      tap(
        categories => {
          this.log(`fetched categoriesUrl:` + categories);
        })
    );
  }

  getFakeCategories() {
    return this.http.get(this.fakeCategoriesUrl).pipe(
      tap(
        categories => {
          this.log(`fetched categoriesUrl:` + categories);
        })
      //catchError(this.handleError('categoriesUrl'))
    );
  }

  private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}


export interface CatalogSearch {
  products: ProductSearch[];
}

export interface ProductSearch {
  id: string;
  name: string;
}