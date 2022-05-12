import { Component, OnInit } from '@angular/core';
import {JanusService} from "../../../lib/services/janus.service";
import {AssetService} from "../../../drone/services/asset.service";
import {PaginatorDto} from "../../../lib/models/paginator.dto";
import {Asset} from "../../../drone/models/asset";

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {

  paginator: PaginatorDto = new PaginatorDto();
  hasStream = false;
  selectedDrone: Asset;

  constructor(
    private assetService: AssetService,
    private janusService: JanusService,
  ) { }

  ngOnInit(): void {
    this.assetService
      .getAllDrones(this.paginator)
      .subscribe((assets) => {
        // You can change this logic for your own
        // For the demonstration purposes, we will just find the first available stream

        for (let i = 0; i < assets.length; i++) {
          const asset = assets[i]
          if(asset.stream) {
            this.selectedDrone = asset;
            this.hasStream = true;
            setTimeout( () => {this.janusService.watchJanusStream(asset.stream.mountPoint)}, 1000);
            // Nothing else to init, so we can just break here...
            break;
          }
        }
      });
  }
}
