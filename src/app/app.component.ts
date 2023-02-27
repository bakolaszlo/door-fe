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
  z: number = 0;
  isModalShown: boolean = false;

  constructor(private sseService: SseService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.registerEventListener();
  }

  registerEventListener(): void {
    this.event$ = this.sseService.getServerSentEvent('https://nextmindbe.azurewebsites.net/api/updates');
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
      
      if(this.x == parseFloat(res.Longitude) && this.y == parseFloat(res.Latitude))
      {
        this.status = res.Alarm;
      }

    });
  }

  ngOnDestroy(): void {
    this.sseService.closeEventSource();
  }

  showIntruderAlert() {
    const modalRef = this.modalService.open(IntruderAlertModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.title = 'Intruder Alert';
    modalRef.componentInstance.body = 'An intruder has been detected.';
  }
  
}
