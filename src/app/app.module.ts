import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SolutionV2Component } from './solution-v2/solution-v2.component';

@NgModule({
  declarations: [
    AppComponent,
    SolutionV2Component
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
