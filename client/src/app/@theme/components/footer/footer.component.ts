import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by" >
      Created with ♥ by <b><a href="https://rishabharya.site/" target="_blank">Rishabh</a></b>, <b><a href="http://laddhashreya2000.github.io/" target="_blank">Shreya</a></b> & <b><a href="https://tezansahu.github.io/" target="_blank">Tezan</a></b>
    </span>
  `,
})
export class FooterComponent {
}
