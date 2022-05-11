import { MavrosState } from "./mavrosState";
import { Position } from "./position";

export class MissionDrone {
    name: string;
    battery: number;
    satellite = 0;
    position: Position;
    gpsFixMode = '';
    compassAngle: number;
    previousD = 0;
    queue: [number, number] = [0, 0];
    deltaT = 0;
    state: MavrosState | null;

    constructor(name?: string, state?: MavrosState, position?: Position, battery?: number, compassAngle?: number) {
        if (name) {
            this.name = name;
        } else {
            this.name = '';
        }

        if (state) {
            this.state = state;
        } else {
            this.state = {
                connected: false,
                armed: false,
                guided: false,
                manual_input: false,
                mode: 'STABILIZE',
                system_status: 0,
                armedString: 'Not Armed'
            };
        }

        if (position) {
            this.position = position;
        } else {
            this.position = { latitude: 0.0, longitude: 0.0, altitude: 0.0 };
        }

        this.battery = battery || 0;

        this.compassAngle = compassAngle || 0;
    }
}
