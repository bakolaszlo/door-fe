import { Component } from '@angular/core';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntruderAlertModalComponent } from './intruder-alert-modal/intruder-alert-modal.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = "NextMind";
  eventSource!: EventSourcePolyfill;
  event$!: Observable<string>;
  status:string = 'Idle';
  x: number = 0;
  y: number = 0;
  precision:number = 5;
  isModalShown: boolean = false;

  constructor(private sseService: SseService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.registerEventListener();
  }

  registerEventListener(): void {
    this.event$ = this.sseService.getServerSentEvent('http://localhost:7058/api/updates');
    this.event$.subscribe(event => {
      console.log(`Received event: ${event}`);
      var res = JSON.parse(event);
      if(res == null){
        this.status = 'Idle';
        return;
      }
      if(res.Alarm !== undefined){
        if(res.Alarm === true){
          if(!this.isModalShown){
            this.showIntruderAlert();
            this.isModalShown = true;
          }
          return;
        }
      }
      // const decimalPoints = this.precision;
      // const latitude = this.roundFloatTo(parseFloat(res.Latitude), decimalPoints);
      // const longitude = this.roundFloatTo(parseFloat(res.Longitude), decimalPoints);

      // console.log(`Results: lat: ${latitude} lon: ${longitude}`);
      // console.log(this.x == latitude && this.y == longitude);
      // if(this.x == latitude && this.y == longitude)
      {
        this.status = res.Alarm;
      }

      if(this.status === 'Authorize'){
        this.showAccessGrantedAlert();
      }

      if(this.status === 'Deny'){
        this.showIntruderAlert();
      }

    });
  }

  roundFloatTo(number: number, decimal:number) : number {
    const decimalPoints = 10 ** decimal;
    return Math.round(number * decimalPoints + Number.EPSILON) / decimalPoints;
  }
  ngOnDestroy(): void {
    this.sseService.closeEventSource();
  }

  showIntruderAlert() {
    const modalRef = this.modalService.open(IntruderAlertModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.modalBackgroundClass = 'modal-background-red';
    modalRef.componentInstance.title = 'Access revoked';
    modalRef.componentInstance.description = 'You lost contact with your access token.';
  }

  showAccessGrantedAlert() {
    const modalRef = this.modalService.open(IntruderAlertModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.modalBackgroundClass = 'modal-background-green';
    modalRef.componentInstance.title = 'Access granted!';
    modalRef.componentInstance.description = 'You can now enter the room.';
  }
  
}
