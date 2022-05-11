export interface MavrosState {
    connected: boolean;
    armed: boolean;
    armedString?: string;
    guided: boolean;
    manual_input: boolean;
    mode: string;
    system_status: number;
}
