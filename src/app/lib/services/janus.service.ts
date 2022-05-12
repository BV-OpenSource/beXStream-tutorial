import {ElementRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JanusService {
  // @ts-ignore
  Janus = require('janus-gateway-js');
  janusPath = 'wss://bexstream.beyond-vision.pt/janus';
  janusClient: any; // Holds the Janus Client object, used to generate connections
  streaming: any; // Streaming object
  videoElement: ElementRef<HTMLVideoElement> | undefined; // DOM element to retain the stream
  connection: any; // Holds the connection to Janus
  videoStopped: boolean; // Used to maintain status of a video stream. You may want to change to an array if you want to have multiple streams
  currentWatch: number | null; // Current streaming being watched


  constructor() {
    this.janusClient = new this.Janus.Client(this.janusPath, {
      debug: 'all',
      keepalive: 'true',
      pc: {config: {
          iceServers: [{
            username: 'coturn',
            credential: 'coturn',
            urls: [ 'turn:213.63.138.90:3478?transport=udp',
            ],
          }]
        },
        iceTransportPolicy: 'relay', },
    });
  }

  // Helper methods to attach/reattach a stream to a video element (previously part of adapter.js)
  attachMediaStream(element: HTMLVideoElement, stream: any) {
    try {
      element.srcObject = stream;

    } catch (e) {
      try {
        element.src = URL.createObjectURL(stream);
      } catch (e) {
        console.log('Janus:error: Error attaching stream to element', e);
      }
    }
  }

  // creates a Janus session
  createConnection(videoViewer: ElementRef<HTMLVideoElement>) {
    this.videoElement = videoViewer;
    if (!this.connection) {
      this.janusClient.createConnection().then((connection: any) => {
        this.connection = connection;
        console.log('New connection', this.connection);
        this.connection.createSession().then((session: any) => {
          session.attachPlugin('janus.plugin.streaming').then((streaming: any) => {
            this.streaming = streaming;
            console.log('Streaming plugin', this.streaming);
            this.streaming.on('pc:track:remote', (event: any) => {
              console.log('Remote event', event);
              const pc = event.target;
              if (pc) {
                pc.iceconnectionstatechange = (e: any) => {
                  console.log('iceconnectionstatechange', e);
                  if (pc.iceConnectionState === 'failed') {
                    pc.restartIce();
                  }
                };
              }
              if (this.videoElement && this.videoElement.nativeElement) {
                const vid = this.videoElement.nativeElement;
                console.log('Attach Video');
                this.attachMediaStream(vid, event.streams[0]);
              }
            });
            // ACK from Janus after stream is stopped
            this.streaming.on('message', (event: any) => {
              if (!this.videoStopped && event._plainMessage.janus === 'hangup') {
                console.log('Hangup Event', event._plainMessage.janus);
                this.videoStopped = true;
              }
            });
            // ACK from Janus when Asset disconnects
            this.streaming.on('detach', (event: any) => {
              if (!this.videoStopped && event._plainMessage.janus === 'hangup') {
                console.log('Detach Event', event._plainMessage.janus);
                this.videoStopped = true;
              }
            });
          });
        });
      }, ((error: any) => {
          console.log('Error connecting janus', error);
        }
      ));
    } else {
      if (this.streaming) {
        console.log('Streaming plugin already created');
      }
    }
  }

  // obtain the stream link, requested by the watch method
  watchJanusStream(streamID: number) {
      const callback = () => {
          this.streaming.watch(streamID).then( () => {
            this.currentWatch = streamID;
          }).catch((error: any) => {
            console.log('Janus:error: Attempt to watch', error);
          });
      };
      setTimeout(callback, 50);
  }

}
