export class ConnectionDTO {
    isConnected: boolean;
    assetName: string;
    mountPoint: number  | null;
    assetId: string;
    battery: number;
    onMission: boolean;
    isFlying: boolean;
    isDrone: boolean;
  
    constructor(assetName: string, mountPoint: number | null, assetId: string, isConnected: boolean,
                battery: number, onMission: boolean, isFlying: boolean, isDrone: boolean ) {
      this.assetName = assetName;
      this.mountPoint = mountPoint;
      this.isConnected = isConnected;
      this.assetId = assetId;
      this.battery = battery;
      this.onMission = onMission;
      this.isFlying = isFlying;
      this.isDrone = isDrone;
    }
  }
  