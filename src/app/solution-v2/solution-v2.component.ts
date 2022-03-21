import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-solution-v2',
  templateUrl: './solution-v2.component.html',
  styleUrls: ['./solution-v2.component.scss']
})
export class SolutionV2Component implements OnInit {

  gameData: {} = {
    "Germany": "Berlin",
    "Poland": "Warsaw",
    "Azerbaijan": "Baku",
    "Papua New Guinea": "Port Moresby"
  };

  shuffledGameKeys: string[] = [];
  shuffledGameValues: any = [];
  selectedItem: { key: string, value: string } = { 'key': '', 'value': '' };

  constructor() { }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    if (!!Object.entries(this.gameData)) {
      this.shuffledGameKeys = Object.keys(this.gameData).sort(() => Math.random() - 0.5);
      this.shuffledGameValues = Object.values(this.gameData).sort(() => Math.random() - 0.5);
    }
  }

  getUserClick(selectedValue: string, type: 'key' | 'value') {
    if (selectedValue) {
      if (this.validateSelectedItems()) {
        this.selectedItem = { 'key': '', 'value': '' };
      }
      if (type == 'key') {
        this.selectedItem.key = selectedValue;
      } else {
        this.selectedItem.value = selectedValue;
      }
      this.checkMatching();
    }
  }

  checkMatching() {
    if (this.validateSelectedItems()) {
      if (this.selectedItem.value == this.getItemValue(this.gameData, this.selectedItem.key)) {
        this.shuffledGameKeys = this.removeMatchedItems(this.shuffledGameKeys, 'key');
        this.shuffledGameValues = this.removeMatchedItems(this.shuffledGameValues, 'value');
        this.selectedItem = { 'key': '', 'value': '' };
      }
    }
  }

  validateSelectedItems() {
    return this.selectedItem && Object.values(this.selectedItem).every(v => v);
  }

  removeMatchedItems(object: string[], type: 'key' | 'value') {
    return !!object.length ? object.filter((e: string) => e !== this.selectedItem[type]) : object;
  }

  getItemValue(obj: any, key: string) {
    return (obj[key]);
  }

}
