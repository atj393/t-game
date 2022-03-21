import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SolutionV2Component } from './solution-v2.component';

describe('SolutionV2Component : ', () => {
  let component: SolutionV2Component;
  let fixture: ComponentFixture<SolutionV2Component>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolutionV2Component]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionV2Component);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    component.initData();
    component.selectedItem = { 'key': 'Germany', 'value': 'Berlin' };
    fixture.detectChanges();
  });

  it('should populate values to shuffled arrays is gameData has value', () => {
    expect(component.shuffledGameKeys.length).toBeGreaterThan(0);
    expect(component.shuffledGameValues.length).toBeGreaterThan(0);
  });

  it('should not populate values to shuffled arrays is gameData is empty', () => {
    component.gameData = {};
    component.initData();
    expect(component.shuffledGameKeys).toHaveSize(0);
    expect(component.shuffledGameValues).toHaveSize(0);
  })

  it('should populate the selected value to the selectedItem', fakeAsync(() => {
    component.getUserClick('Poland', 'key');
    expect(component.selectedItem).toEqual({ 'key': 'Poland', 'value': '' });
  }));

  it('should not populate selectedItem if selected value is empty', fakeAsync(() => {
    component.selectedItem = { 'key': '', 'value': '' };
    component.getUserClick('', 'key');
    expect(component.selectedItem).toEqual({ 'key': '', 'value': '' });
  }));

  it('should remove the items if the key and value matches', () => {
    component.checkMatching();
    expect(component.shuffledGameKeys.length).toBeLessThan(Object.entries(component.gameData).length);

    expect(component.shuffledGameValues.length).toBeLessThan(Object.entries(component.gameData).length);
  });


  it('should not remove the items if the key and value does not matches', () => {
    component.selectedItem = { 'key': 'Germany', 'value': 'Warsaw' };

    component.checkMatching();
    expect(component.shuffledGameKeys).toHaveSize(Object.entries(component.gameData).length);

    expect(component.shuffledGameValues).toHaveSize(Object.entries(component.gameData).length);
  });

  it('should be true if both items are selected', () => {
    expect(component.validateSelectedItems()).toBeTrue()
  });

  it('should be false if either one or no items are selected', () => {
    component.selectedItem = { key: '', value: '' };
    expect(component.validateSelectedItems()).toBeFalse()
    component.selectedItem.key = '';
    expect(component.validateSelectedItems()).toBeFalse()
    component.selectedItem.value = '';
    expect(component.validateSelectedItems()).toBeFalse()
  });


  it('should removed matched items if all parameters are full', () => {
    const filterKey = component.removeMatchedItems(component.shuffledGameKeys, 'value');
    expect(filterKey.indexOf(component.selectedItem.value)).toEqual(-1);

    const filterValue = component.removeMatchedItems(component.shuffledGameValues, 'value');
    expect(filterValue.indexOf(component.selectedItem.value)).toEqual(-1);
  });

  it('should fail to remove items if object or selectedItems are empty', () => {
    component.selectedItem = { key: '', value: '' };

    const filter = component.removeMatchedItems(component.shuffledGameKeys, 'key');
    expect(filter).toHaveSize(Object.entries(component.gameData).length);

    const filterValue = component.removeMatchedItems(component.shuffledGameValues, 'value');
    expect(filterValue).toHaveSize(Object.entries(component.gameData).length);
    expect(component.removeMatchedItems([], 'value')).toEqual([]);

  });

  it('should return a value if the key is present in the object', () => {
    expect(component.getItemValue(component.selectedItem, 'key')).toBeTruthy();
    expect(component.getItemValue(component.gameData, component.selectedItem.key)).toBeTruthy();
  });

  it('should not return any value if the key is not present in the object', () => {
    expect(component.getItemValue(component.selectedItem, 'test')).toBeFalsy();
    expect(component.getItemValue({}, 'test')).toBeFalsy();
    expect(component.getItemValue(component.selectedItem, '')).toBeFalsy();
    expect(component.getItemValue({}, '')).toBeFalsy();
  });

  it('should be displayed all the items in the gameData object separately', fakeAsync(() => {
    expect(el.queryAll(By.css('ul > li'))).toHaveSize(Object.entries(component.gameData).length * 2);
  }));

  it('should not be displayed any data if the gameData object is empty', fakeAsync(() => {
    component.gameData = {};
    component.initData();
    fixture.detectChanges();
    expect(el.queryAll(By.css('ul > li'))).toHaveSize(0);
  }));

  it('should be added the value to the selectItem object when click on a button', fakeAsync(() => {
    let btnElements = el.queryAll(By.css('ul > li > button'))[0].nativeElement as HTMLElement;
    btnElements.click();
    fixture.detectChanges();
    expect(component.selectedItem.key).toBe(btnElements.innerHTML);
  }));


  it('should remove the matched items from the view when clicked', fakeAsync(() => {

    const btnArray: string[] = ['Poland', 'Warsaw'];
    let btnElements = el.queryAll(By.css('ul > li > button'));

    btnElements.forEach((element) => {
      if (btnArray.includes(element.nativeElement.innerHTML)) {
        element.nativeElement.click();
        fixture.detectChanges();
      }
    })
    fixture.whenStable();

    expect(el.queryAll(By.css('ul > li'))).toHaveSize((Object.entries(component.gameData).length * 2) - 2);

  }));

  it('should be highlighted the clicked button', fakeAsync(() => {
    let btnElement = el.queryAll(By.css('ul > li > button'))[0].nativeElement as HTMLElement;
    btnElement.click();
    fixture.detectChanges();
    expect(btnElement).toHaveClass('selected');
  }));

  it('should be highlighted both key and value buttons when it did not matched', fakeAsync(() => {

    const btnArray: string[] = ['Germany', 'Warsaw'];
    let btnElements = el.queryAll(By.css('ul > li > button'));
    btnElements.forEach((element) => {
      if (btnArray.includes(element.nativeElement.innerHTML)) {
        element.nativeElement.click();
        fixture.detectChanges();
      }
    })
    fixture.whenStable();
    expect(el.queryAll(By.css('ul > li > button.wrong'))).toHaveSize(2);
  }));

  it('should display the text "Congratulations" when all the items are selected', () => {
    component.shuffledGameKeys = [];
    component.shuffledGameValues = [];
    fixture.detectChanges();
    expect((el.query(By.css('h2')).nativeElement as HTMLElement).innerText).toBe('Congratulations');
  });

  it('should repopulate the view when click on the "Play Again" button', () => {
    component.shuffledGameKeys = [];
    component.shuffledGameValues = [];
    fixture.detectChanges();
    (el.query(By.css('button')).nativeElement as HTMLElement).click();
    fixture.detectChanges();
    fixture.whenStable();
    expect(el.queryAll(By.css('ul > li > button'))).toHaveSize(Object.entries(component.gameData).length * 2);
  })

});