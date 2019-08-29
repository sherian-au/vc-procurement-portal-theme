import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UpdateOrganization } from '../models/organization';
import { AlertsService } from '../modules/alerts/alerts.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  constructor(private http: HttpClient, private aletsService: AlertsService) {}

  getUserOrganization() {
    console.log('getUserOrganization');
    return this.http.get('storefrontapi/account/organization/current?t=').pipe(
      tap(organization => {
        this.log(`fetched organization:` + organization);
      }),
      catchError(error => this.handleError(error))
    );
  }

  getOrganizationUsers(pageNumber: number, pageSize: number) {
    const url = 'storefrontapi/account/organization/users/search';
    const body = {
      pageNumber: pageNumber,
      start: (pageNumber - 1) * pageSize,
      pageSize: pageSize
    };
    return this.http
      .post<any>(url, body)
      .pipe(catchError(error => this.handleError(error)));
  }

  updateOrganization(organization: UpdateOrganization) {
    const url = 'storefrontapi/account/organization';
    return this.http
      .put<any>(url, organization)
      .pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: any) {
    if (error.status === 500) {
      this.aletsService.error(
        `An error occurred with code ${error.status} while trying to execute a request to the server`
      );
    } else if (error.status === 400) {
      this.aletsService.warn(
        `An error occurred with code ${error.status} while trying to execute a request to the server`
      );
    }
    return throwError(error);
  }

  private log(message: string) {
    console.log('Organization service: ' + message);
  }
}
