import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PaginatorDto } from 'src/app/lib/models/paginator.dto';
import { Asset } from '../../models/asset';
import { MavrosState } from '../../models/mavrosState';
import { MissionDrone } from '../../models/missionDrone';
import { Position } from '../../models/position';
import { Velocity } from '../../models/velocity';
import { AssetService } from '../../services/asset.service';
import {JanusService} from "../../../lib/services/janus.service";

@Component({
  selector: 'app-drone-list',
  templateUrl: './drone-list.component.html',
  styleUrls: ['./drone-list.component.less']
})
export class DroneListComponent implements OnInit, OnDestroy {

  assets: Asset[] = [];
  paginator: PaginatorDto = new PaginatorDto();
  subscriptions: Subscription = new Subscription();

  selectedAsset: Asset = null;

  DRONE_FE_MAX_SPEED = 3.0; // Drone Frontend Constant Default Value

  constructor(private assetService: AssetService,
              private janusService: JanusService,) { }

  ngOnInit(): void {
    this.paginator.limit = 0;
    this.paginator.filter = '';
    this.listDrones();

    this.assetService.initSocket();
  }

  ngOnDestroy() {
    this.subscriptions?.unsubscribe();
    this.assetService.closeSocket();
  }

  private listDrones() {
    this.assetService
      .getAllDrones(this.paginator)
      .subscribe((assets: Asset[]) => {
        this.assets = assets;
      })
  }

  downloadConfig(droneId: string) {
    this.assetService
        .downloadConfig(droneId)
        .subscribe(data => {
            this.downloadFile(data.cypher);
        });
  }

  downloadFile(data: string) {
    const blob = new Blob([data], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = 'config.bext';
    anchor.href = url;
    anchor.click();
  }

  public selectAsset(selectedAsset: Asset) {
    this.selectedAsset = selectedAsset;
    this.selectedAsset.drone.md = new MissionDrone();
    if(selectedAsset.stream) {
      setTimeout( () => {
        this.janusService.watchJanusStream(selectedAsset.stream.mountPoint)}, 1000);

    }

    this.initSubscriptions();
  }

  public initSubscriptions() {
    this.assetService.sendSelectedAsset(this.selectedAsset.id);

    this.subscriptions?.add(this.assetService.getAssetPos(this.selectedAsset.id).subscribe((data: Position) => {
      if (this.selectedAsset.drone) {
          this.selectedAsset.drone.md.position.latitude = data.latitude;
          this.selectedAsset.drone.md.position.longitude = data.longitude;
          this.selectedAsset.drone.md.position.altitude = data.altitude;
      }
    }));

    this.subscriptions?.add(this.assetService.getDroneState(this.selectedAsset.id).subscribe((data: MavrosState) => {
      if (this.selectedAsset.drone) {
          this.selectedAsset.drone.md.state = data;

          if (data.system_status > 3) { // flying
            this.selectedAsset.drone.flightStatus.isFlying = true;
            this.selectedAsset.drone.flightStatus.isLanded = false;
          } else if (data.system_status === 3) { // landed and ready to takeoff
            this.selectedAsset.drone.flightStatus.isFlying = false;
            this.selectedAsset.drone.flightStatus.isLanded = true;
          }
      }
    }));

  }

  /**
   * Commands to control the drone.
   */
  public takeOffDrone() {
    const droneData = { msg: '', assetName: this.selectedAsset.name, assetId: this.selectedAsset.id };
    this.assetService.sendDroneTakeoff(droneData);
  }

  public landDrone() {
    const droneData = { msg: '', assetName: this.selectedAsset.name, assetId: this.selectedAsset.id };
    this.assetService.sendDroneLand(droneData);
  }

  public moveDroneLeft() {
    const vel: Velocity = { x: 0.0, y: 3.0, z: 0.0, roll: 0.0, pitch: 0.0, yaw: 0.0 };
    const droneDataVel = { msg: vel, assetName: this.selectedAsset.name, assetId: this.selectedAsset.id };

    vel.y = this.DRONE_FE_MAX_SPEED;

    this.assetService.sendDroneVel(droneDataVel);
  }

  public moveDroneRight() {
    const vel: Velocity = { x: 0.0, y: 0.0, z: 0.0, roll: 0.0, pitch: 0.0, yaw: 0.0 };
    const droneDataVel = { msg: vel, assetName: this.selectedAsset.name, assetId: this.selectedAsset.id };

    vel.y = - this.DRONE_FE_MAX_SPEED;

    this.assetService.sendDroneVel(droneDataVel);
  }


  public moveDroneForward() {
    const vel: Velocity = { x: 0.0, y: 3.0, z: 0.0, roll: 0.0, pitch: 0.0, yaw: 0.0 };
    const droneDataVel = { msg: vel, assetName: this.selectedAsset.name, assetId: this.selectedAsset.id };

    vel.x = this.DRONE_FE_MAX_SPEED;

    this.assetService.sendDroneVel(droneDataVel);
  }

  public moveDroneBack() {
    const vel: Velocity = { x: 0.0, y: 0.0, z: 0.0, roll: 0.0, pitch: 0.0, yaw: 0.0 };
    const droneDataVel = { msg: vel, assetName: this.selectedAsset.name, assetId: this.selectedAsset.id };

    vel.x = - this.DRONE_FE_MAX_SPEED;

    this.assetService.sendDroneVel(droneDataVel);
  }

}
