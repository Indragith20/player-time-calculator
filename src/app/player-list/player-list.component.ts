import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { IPlayer } from '../interfaces/player.interface';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {
  playerList: IPlayer[];
  playerListForm: FormGroup;
  timerInterval: any;

  get PlayerListFormArray() {
    return (this.playerListForm.get('playerList') as FormArray).controls;
  }

  constructor(private appService: AppService, private fb: FormBuilder) { }

  ngOnInit() {
    this.playerList = this.appService.getPlayerDetails();
    console.log(this.playerList);
    this.createForm();
  }

  createForm() {
    this.playerListForm = this.fb.group({
      playerList: this.fb.array([])
    });
    this.playerList.map((player, index) => {
      const newFormGroup = this.fb.group({
        id: index,
        playerName: [player.playerName],
        jerseyNumber: [player.jerseyNumber],
        minutes: [player.minutes],
        seconds: [player.seconds],
        timer: [player.timer]
      });
      (this.playerListForm.get('playerList') as FormArray).push(newFormGroup);
    });
    console.log(this.playerListForm.value);
  }

  onClickPlayer(player: FormGroup) {
    console.log(player);
    const currentPlayersList = (this.playerListForm.get('playerList') as FormArray).controls;
    currentPlayersList.map((playerFormGroup) => {
      if(playerFormGroup.get('id').value === player.get('id').value) {
        playerFormGroup.patchValue({
          timer: !player.get('timer').value
        });
      } else {
        playerFormGroup.patchValue({
          timer: false
        });
      }
    });
    if(this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    console.log('Modified');
    console.log(player.get('timer').value);
    let seconds = player.get('seconds').value;
    let minutes = player.get('minutes').value;
    const startTimerAction = player.get('timer').value ===  true ? true : false;
    if(startTimerAction) {
      this.timerInterval = setInterval(() => {
        seconds = seconds + 1;
          if(seconds === 60) {
            minutes = minutes + 1;
            seconds = 0;
          }
          player.patchValue({
            minutes: minutes,
            seconds: seconds
          });
      }, 1000);
    } else {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

}
