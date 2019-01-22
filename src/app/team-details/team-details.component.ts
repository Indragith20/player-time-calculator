import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { AppService } from '../app.service';
import { IPlayer } from '../interfaces/player.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss']
})
export class TeamDetailsComponent implements OnInit {
  teamDetailsForm: FormGroup;
  numberOfPlayers: number[] = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  get playerDetailsFormData() {
    return (this.teamDetailsForm.get('playerDetails') as FormArray).controls;
  }

  constructor(private fb: FormBuilder, private appService: AppService, private router: Router) {
  }

  ngOnInit() {
    this.teamDetailsForm = this.fb.group({
      totalPlayers: [''],
      playerDetails: this.fb.array([this.createPlayerList()])
    });
    console.log((this.teamDetailsForm.get('playerDetails') as FormArray).controls);
  }

  createPlayerList() {
    return this.fb.group({
      playerName: new FormControl(''),
      jerseyNumber: new FormControl('')
    });
  }

  onClick() {
    const selectedNumber = this.teamDetailsForm.get('totalPlayers').value;
    for (let i = 0; i < selectedNumber; i++) {
      /* this.playerDetailsFormData.push(this.createPlayerList()); */
      (this.teamDetailsForm.get('playerDetails') as FormArray).push(this.createPlayerList());
    }
  }

  proceed() {
    console.log(this.teamDetailsForm.get('playerDetails').value);
    const playerList = this.teamDetailsForm.get('playerDetails').value;
    const modifiedPlayerList: IPlayer[] = playerList.map((player) => {
      return {...player, minutes: 0, seconds: 0, timer: false };
    });
    this.appService.setPlayerDetails(modifiedPlayerList);
    this.router.navigate(['/player-list']);
  }

}
