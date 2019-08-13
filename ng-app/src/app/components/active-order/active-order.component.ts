import { Component, OnInit, Input, isDevMode } from '@angular/core';
import { ActiveOrderService } from '../../services/active-order.service';

import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ILineItem, ICart } from 'src/app/models/dto/icart';
import { ConfirmService } from 'src/app/modules/confirm-modal/confirm-modal-service';

@Component({
  selector: 'app-active-order',
  templateUrl: './active-order.component.html',
  styleUrls: ['./active-order.component.scss']
})
export class ActiveOrderComponent implements OnInit {

  cart$: Observable<ICart>;

  constructor(private activeOrderService: ActiveOrderService, private confirmService: ConfirmService) {
    // this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.cart$ = this.activeOrderService.Cart;
    this.cart$.subscribe();
    this.activeOrderService.refreshCart();
  }

  removeItem(item: ILineItem) {
    const confirmOptions = { title: 'Line item removing', message: 'Are you sure you want to remove this line item from the active order?' };
    this.confirmService.confirm(confirmOptions).then(() => this.activeOrderService.removeItem(item.id).subscribe() );
  }

  clear() {
    const confirmOptions = { title: 'Active order cleaning', message: 'Are you sure you want to clear the active order?' };
    this.confirmService.confirm(confirmOptions).then(() => this.activeOrderService.clearAllItems().subscribe() );
  }

  decrementQuantity(item: ILineItem) {
    if (item.quantity <= 1) {
      this.removeItem(item);
      return;
    }
    item.quantity--;
    this.activeOrderService
      .changeItemQuantity(item.id, item.quantity)
      .subscribe();
  }

  incrementQuantity(item: ILineItem) {
    item.quantity++;
    this.activeOrderService
      .changeItemQuantity(item.id, item.quantity)
      .subscribe();
  }

  updateLineItemQuantity(lineItem: ILineItem) {
    this.activeOrderService
      .changeItemQuantity(lineItem.id, lineItem.quantity)
      .subscribe();
  }

  checkout(cart: ICart) {
    // console.log(cart);
    this.activeOrderService.createOrder().subscribe();

  }

}
