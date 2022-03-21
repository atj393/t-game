import { Component } from '@angular/core';

export class SelectedModel {
  'name': string;
  'value': string;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 't-game';
  viewToggle: boolean = false;

  randomNumber = Math.floor(Math.random() * 10) + 1;
  gameData: any = {
    "Germany": "Berlin",
    "Poland": "Warsaw",
    "Azerbaijan": "Baku",
    "Papua New Guinea": "Port Moresby"
  };
  shuffledGameData: any = {};
  selectedItem: SelectedModel = { 'name': '', 'value': '' };


  constructor() {
    this.shuffledGameData = this.shuffle(this.gameData);
  }

  shuffle(obj: any) {
    return Object.entries(obj)
      .map((key) => {
        return ({ 'name': key[0], 'value': key[1] });
      }).map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }


  check(selectedValue: any, type: string) {
    if (selectedValue && type) {
      if (Object.values(this.selectedItem).every(v => v)) {
        this.selectedItem = { 'name': '', 'value': '' };
      }
      if (type == 'name') {
        this.selectedItem.name = selectedValue;
      } else if (type == 'value') {
        this.selectedItem.value = selectedValue;
      } else {
        return;
      }
      if (Object.values(this.selectedItem).every(v => v)) {
        if (this.selectedItem.value == this.gameData[this.selectedItem.name]) {
          delete this.gameData[this.selectedItem.name];
          this.shuffledGameData = this.shuffle(this.gameData);
          this.selectedItem = { 'name': '', 'value': '' };
        }
      }
    }
  }

}
