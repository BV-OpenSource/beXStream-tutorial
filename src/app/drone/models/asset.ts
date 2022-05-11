import { Drone } from "./drone";
import { Stream } from "./stream";

export class Asset {

    id: string;
    name: string;
    mountPoint: number | null;
    isActive: boolean;
    drone?: Drone;
    lastConnected: Date | null;

    isDirectConnect?: boolean; // usually via telemetry
    missionCount?: number | null;

    stream?: Stream;

    constructor(type: string) {
        if (type === 'Drone') {
          this.drone = new Drone();
        }
        this.id = '';
        this.name = '';
        this.mountPoint = null;
        this.isActive = false;
        this.lastConnected = null;

    }
}
