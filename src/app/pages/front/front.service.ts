import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { User } from "../../types/user";

@Injectable({ providedIn: "root" })
export class FrontService {

  constructor(private http: HttpClient) { }

  getFeed(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users/purchases?limit=10`);
  }

  getHighscore(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/statistics/highscore`);
  }
}
