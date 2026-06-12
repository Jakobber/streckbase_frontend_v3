import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../../environments/environment";

export interface Multipliers {
  xlob: number;
  andra: number;
  najs: number;
}

@Injectable({ providedIn: "root" })
export class SettingsService {
  constructor(private http: HttpClient) { }

  getMultipliers(): Observable<Multipliers> {
    return this.http.get<Multipliers>(`${environment.apiUrl}/settings/multipliers`);
  }

  updateMultipliers(multipliers: Multipliers): Observable<Multipliers> {
    return this.http.put<Multipliers>(`${environment.apiUrl}/settings/multipliers`, multipliers);
  }

  applyMultipliers(multipliers: Multipliers): Observable<any> {
    return this.http.post(`${environment.apiUrl}/settings/multipliers/apply`, multipliers);
  }
}
