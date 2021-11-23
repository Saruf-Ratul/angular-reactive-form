import { Component, Input } from '@angular/core';

@Component({
  selector: 'hello',
  template: `<mat-toolbar color="primary">
              <h1><span class="heart">❤</span> {{ name }} </h1>
            </mat-toolbar>`,
  styles: [`h1 { font-family: Lato; } .heart { color: #f95372; }`]
})
export class HelloComponent  {
  @Input() name: string;
}
