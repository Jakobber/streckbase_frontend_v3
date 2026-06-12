import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../../environments/environment";
import { Item } from "../../../types/item";

@Injectable({ providedIn: "root" })
export class ProductsService {

  constructor(private http: HttpClient) { }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${environment.apiUrl}/items?limit=1000`);
  }

  updateItem(item: Item, isNew: boolean): Observable<Item> {
    if (isNew) {
      return this.http.post<Item>(`${environment.apiUrl}/items`, item);
    } else {
      return this.http.put<Item>(`${environment.apiUrl}/items/${item.id}`, item);
    }
  }

  getArchivedItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${environment.apiUrl}/items/archived?limit=1000`);
  }

  deleteItem(item: Item): Observable<Item> {
    return this.http.delete<Item>(`${environment.apiUrl}/items/${item.id}`);
  }

  restoreItem(item: Item): Observable<any> {
    return this.http.put(`${environment.apiUrl}/items/${item.id}/restore`, {});
  }
}
