import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { IOrder, OrderSearchCriteria } from '../models/dto/iorder';
import { AlertsService } from '../modules/alerts/alerts.service';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private ordersUrl = 'storefrontapi/orders/search';
  private approvalWorkflowUrl = 'api/approvalWorkflow';
  private orderUrl = 'storefrontapi/orders';

  constructor(private http: HttpClient, private aletsService: AlertsService) {}

  getOrders(
    pageNumber: number = 1,
    pageSize: number = 10,
    startDate: Date = null,
    endDate: Date = null,
    status: string = ''
  ) {
    const searchCriteria = new OrderSearchCriteria();
    searchCriteria.pageNumber = pageNumber;
    searchCriteria.pageSize = pageSize;
    searchCriteria.StartDate = startDate;
    searchCriteria.EndDate = endDate;
    if (status === 'All') {
      searchCriteria.Status = '';
    } else {
      searchCriteria.Status = status;
    }
    return this.http.post(this.ordersUrl, searchCriteria).pipe(
      tap(orders => {
        this.log(`fetched ordersUrl:` + orders);
      }),
      catchError(error => this.handleError(error))
    );
  }

  getOrder(OrderNumber: string) {
    return this.http.get(this.orderUrl + `/${OrderNumber}`).pipe(
      tap(order => {
        this.log(`fetched ordersUrl:` + order);
      }),
      catchError(error => this.handleError(error))
    );
  }

  updateOrder(order: IOrder): Observable<IOrder> {
    return this.http
      .post<IOrder>(this.ordersUrl, order)
      .pipe(catchError(error => this.handleError(error)));
  }

  getApprovalWorkflow() {
    return this.http.get(this.approvalWorkflowUrl).pipe(
      tap(workflow => {
        this.log(`fetched approvalWorkflowUrl:` + workflow);
      }),
      catchError(error => this.handleError(error))
    );
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
    console.log('Orders service: ' + message);
  }
}
