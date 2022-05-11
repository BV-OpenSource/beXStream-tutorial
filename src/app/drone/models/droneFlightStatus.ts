export class DroneFlightStatus {
    id?: string;
    isTakeOff: boolean;
    isLanded: boolean;
    isFlying: boolean;
    guided: boolean;
    armed: boolean;
    connected: boolean;
    lastKnownBattery: number;
    lastLandDate?: Date;
    lastTakeOffDate?: Date;

    constructor() {
        this.isLanded = true;
        this.isFlying = false;
        this.isTakeOff = false;
        this.armed = false;
        this.connected = false;
        this.lastKnownBattery = 0;
        this.guided = false;
    }
}
