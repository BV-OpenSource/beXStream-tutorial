import { Component, OnInit } from '@angular/core';
import {JanusService} from "../../../lib/services/janus.service";
import {AssetService} from "../../../drone/services/asset.service";
import {PaginatorDto} from "../../../lib/models/paginator.dto";

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {

  paginator: PaginatorDto = new PaginatorDto();
  hasStream = false;

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
        assets.forEach(asset => {
          console.log(asset);
          if(asset.stream) {
            this.janusService.watchJanusStream(asset.stream.mountpoint);
            this.hasStream = true;
            // Nothing else to init, so we can just return here...
            return;
          }
        })
      });
  }

}
