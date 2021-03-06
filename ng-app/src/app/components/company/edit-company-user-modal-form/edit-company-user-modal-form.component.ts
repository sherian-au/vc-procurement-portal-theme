import { Component, OnInit, Input } from '@angular/core';
import { EditUser} from '@models/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { OrderWorkflowService } from '@services/order-workflow.service';

@Component({
  selector: 'app-edit-company-user-modal-form',
  templateUrl: './edit-company-user-modal-form.component.html',
  styleUrls: ['./edit-company-user-modal-form.component.scss']
})
export class EditCompanyUserModalFormComponent implements OnInit {
  @Input() user: EditUser;
  @Input() editUserMode: boolean;
  changePassword: boolean;
  workflowRoles: string[];
  selectedWorkflowRole: string = null;

  constructor(public activeModal: NgbActiveModal, private workflowService: OrderWorkflowService) {
    this.workflowRoles = this.workflowService.getAllRoles();
  }

  ngOnInit() {
    if (!this.user) {
      this.user = new EditUser();
    }
  }

  passBack(userView: NgForm) {
    if (userView.form.valid) {
      this.activeModal.close(userView.value);
    }
  }

  checkValid(form: NgForm) {
    form.form.controls.confirmPassword.updateValueAndValidity();
  }

  closeModal() {
    this.activeModal.dismiss();
  }

}
