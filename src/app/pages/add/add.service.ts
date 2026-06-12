import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { SystembolagetItem } from "./systembolaget-item";

@Injectable({ providedIn: "root" })
export class AddService {

  constructor(private http: HttpClient) { }

  getSystembolagetMetadata(query: string): Observable<SystembolagetItem> {
    return this.http.get<any>(`${environment.apiUrl}/systembolaget?q=${encodeURIComponent(query)}`);
  }
}
