import { Injectable } from '@angular/core';
import { IPlayer } from './interfaces/player.interface';

@Injectable()
export class AppService {
    playerDetailsWithJerseyNumber: IPlayer[] = [];
    constructor() {}

    setPlayerDetails(playerDetails: IPlayer[]) {
        this.playerDetailsWithJerseyNumber = [...playerDetails];
    }

    getPlayerDetails() {
        return this.playerDetailsWithJerseyNumber;
    }
}
