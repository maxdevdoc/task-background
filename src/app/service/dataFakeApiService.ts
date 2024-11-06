import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {concatMap, from, Observable, of, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {Store} from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class MainPageService {
  private apiUrl = 'http://localhost:3000/data';

  constructor(private http: HttpClient,
              private store: Store) {}

  getFormData(): Observable<{ [formId: string]: any[] }> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(response => {
        const groupedData = response.reduce((acc, item) => {
          const formId = item.form_id;
          if (!acc[formId]) {
            acc[formId] = [];
          }
          acc[formId].push(item);
          return acc;
        }, {} as { [formId: string]: any[] });

        return groupedData;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  saveForm(form: any): Observable<void> {
    if (!form.fields || form.fields.length === 0) {
      return of();
    }

    return from(form.fields).pipe(
      concatMap((field: any) => {
        const url = `${this.apiUrl}/${field.id}`;

        return this.http.put<void>(url, field, {
          headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }).pipe(
          map(() => {
            return undefined;
          }),
          catchError(error => {
            return throwError(() => error);
          })
        );
      }),
      map(() => {
        return undefined;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  createField(field: any): Observable<void> {
    const url = `${this.apiUrl}`;

    return this.http.post<void>(url, field, {
      headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).pipe(
      map(() => {
        return undefined;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

}
