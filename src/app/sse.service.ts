import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventSourcePolyfill } from 'event-source-polyfill';



@Injectable({
  providedIn: 'root'
})
export class SseService {
  private eventSource!: EventSourcePolyfill;
  constructor() { }

  getServerSentEvent(url: string): Observable<string> {
    return new Observable<string>(observer => {
      this.eventSource = new EventSourcePolyfill(url);

      this.eventSource.onmessage = event => {
        observer.next(event.data);
      };

      this.eventSource.onerror = error => {
        observer.error(error);
      };
    });
  }

  closeEventSource(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
