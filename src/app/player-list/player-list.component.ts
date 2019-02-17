import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { IPlayer } from '../interfaces/player.interface';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
  providers: [ExcelService]
})
export class PlayerListComponent implements OnInit {
  playerList: IPlayer[];
  playerListForm: FormGroup;
  timerInterval: any;

  get PlayerListFormArray() {
    return (this.playerListForm.get('playerList') as FormArray).controls;
  }

  constructor(private appService: AppService, private fb: FormBuilder, private excelService: ExcelService) { }

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

  downloadExcel() {
    const playerData = this.playerListForm.get('playerList').value;
    const data = playerData.map((player) => {
      return {
        PlayerId: player.id,
        PlayerName: player.playerName,
        JerseyNumber: player.jerseyNumber,
        Minutes: player.minutes,
        Seconds: player.seconds
      };
    });
    this.excelService.exportAsExcelFile(data, 'PlayerInTime');
  }

}
