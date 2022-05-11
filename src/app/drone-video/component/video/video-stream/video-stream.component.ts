import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {JanusService} from "../../../../lib/services/janus.service";

@Component({
  selector: 'app-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.css']
})
export class VideoStreamComponent implements AfterViewInit, OnDestroy {

  constructor(private janusService: JanusService) {}

  @ViewChild('videostream', { static: false, read: ElementRef }) videoElement: ElementRef<HTMLVideoElement> | undefined;
  ngAfterViewInit(): void {
    if (this.videoElement) {
      console.log('Start Video Stream');
      this.janusService.createConnection(this.videoElement);
    }
  }

  ngOnDestroy(): void {
    console.log('Closing Video Stream');
  }

}
