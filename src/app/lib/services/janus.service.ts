import {ElementRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JanusService {
  // @ts-ignore
  Janus = require('janus-gateway-js');
  janusPath = 'wss://bexstream.beyond-vision.pt/janus';
  janusClient: any;
  streaming: any;
  videoElement: ElementRef<HTMLVideoElement> | undefined;
  connection: any;
  videoStopped: boolean;
  currentWatch: number | null;


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
    console.log('Connnection', this.connection);
    if (!this.connection) {
      this.janusClient.createConnection().then((connection: any) => {
        this.connection = connection;
        //this.reconnect = false;
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


  watchJanusStream(streamID: number) {
    console.log('asset ID', streamID);
      const callback = () => {
        //if (this.videoStopped) {
          console.log('Resuming video');
          //this.videoStopped = false;
          this.streaming.watch(streamID).then( () => {
            this.currentWatch = streamID;
          }).catch((error: any) => {
            console.log('Janus:error: Attempt to watch', error);
          });
        //} else {
        //  console.log('Timeout');
        //  setTimeout(callback, 50);
        //}

      };
      setTimeout(callback, 50);
  }

}
