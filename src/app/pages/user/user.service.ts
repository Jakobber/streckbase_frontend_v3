import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { Item } from "../../types/item";
import { User } from "../../types/user";

@Injectable({ providedIn: "root" })
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${userId}/purchases?limit=20`);
  }

  purchaseItem(userId: string, item: Item, najs: boolean = false): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users/${userId}/purchases`, { ...item, najs });
  }

  deletePurchase(userId: string, purchaseId: number): Observable<any> {
    return this.http.delete<User>(`${environment.apiUrl}/users/${userId}/purchases/${purchaseId}`);
  }
}
