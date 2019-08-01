import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SearchCategoriesResult, Category, CategorySearchCriteria, CategoryResponseGroup } from '../models/dto/category';
import { ProductSearchCriteria, IProduct, SearchProductsResult } from '../models/dto/product';

//import { IProductSearch, ICatalogSearch } from '../models/ProductSearch';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class CatalogService {

  constructor(private http: HttpClient) {}

  getAllProducts(pageNumber: number, pageSize: number, categoryId: string, keyword: string) {
    //const url = window.location.origin;
    //const body = { keyword: "", start: "0", isFuzzySearch: true, pageSize: "1000" };
    const searchCriteria = new ProductSearchCriteria();
    searchCriteria.pageNumber = pageNumber;
    searchCriteria.pageSize = pageSize;
    searchCriteria.keyword = keyword;
    //searchCriteria.
    const url = 'storefrontapi/catalog/search';
    return this.http.post<SearchProductsResult>(url, searchCriteria);
  }

  getAllCategories(): Observable<Category[]> {
    //const searchCriteria = { keyword: "", start: "0", isFuzzySearch: true, pageSize: "1000" };
    const searchCriteria = new CategorySearchCriteria();
    searchCriteria.pageSize = 1000;
    searchCriteria.responseGroup = CategoryResponseGroup.Info;
    const url = 'storefrontapi/categories/search';
    return this.http.post<SearchCategoriesResult>(url, searchCriteria).pipe(map(x => x.categories));
  }

  getProduct(productId: string) {
    const url = 'storefrontapi/products?productIds=';
    return this.http.get(url + productId);
  }


}


export interface CatalogSearch {
   products: IProduct[];
 }
