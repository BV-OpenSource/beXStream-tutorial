import { DroneFlightStatus } from "./droneFlightStatus";
import { MissionDrone } from "./missionDrone";

export class Drone {
    id: string;
    latitude: number; // last latitude recorded once disconnects
    longitude: number; // last longitude recorded once disconnects
    onMission: boolean;
    hasCamera?: boolean;
    has360Camera?: boolean;
    hasSpeaker?: boolean;
    isDirectConnect?: boolean; // usually via telemetry
    md: MissionDrone;
    flightStatus: DroneFlightStatus;

    constructor() {
        this.id = '';
        this.latitude = 0.0;
        this.isDirectConnect = false;
        this.longitude = 0.0;
        this.onMission = false;
        this.hasSpeaker = false;
        this.hasCamera = false;
        this.has360Camera = false;
        this.md = new MissionDrone();
        this.flightStatus = new DroneFlightStatus();

    }
}
