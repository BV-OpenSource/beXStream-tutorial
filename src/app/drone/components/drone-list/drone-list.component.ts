import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../services/asset.service';
import {Asset} from "../../models/asset";
import {PaginatorDto} from "../../../lib/models/paginator.dto";

@Component({
  selector: 'app-drone-list',
  templateUrl: './drone-list.component.html',
  styleUrls: ['./drone-list.component.less']
})
export class DroneListComponent implements OnInit {

  assets: Asset[] = [];
  paginator: PaginatorDto = new PaginatorDto();

  constructor(private assetService: AssetService) { }

  ngOnInit(): void {
    this.listDrones();
  }

  private listDrones() {
    this.assetService
      .getAllDrones(this.paginator)
      .subscribe((assets) => {
        this.assets = assets;
      });
  }
}
