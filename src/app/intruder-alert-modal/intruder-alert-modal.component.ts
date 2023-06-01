import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-intruder-alert-modal',
  templateUrl: './intruder-alert-modal.component.html',
  styleUrls: ['./intruder-alert-modal.component.scss']
})
export class IntruderAlertModalComponent {
  modalBackgroundClass = 'modal-background-red';
  title: string = "Intruder Alert!";
  description: string = "An intruder has been detected.";

  @Output() modalBackgroundClassChange = new EventEmitter<string>();

  showModalGreen(){
    this.modalBackgroundClass = 'modal-background-green';
    this.title = "Access granted!";
    this.description = "You can now enter the room."
    this.modalBackgroundClassChange.emit(this.modalBackgroundClass);
  }

  showModalRed(){
    this.modalBackgroundClass = 'modal-background-red';
    this.title = "Intruder Alert!";
    this.description = "An intruder has been detected."
    this.modalBackgroundClassChange.emit(this.modalBackgroundClass);
  }
}
