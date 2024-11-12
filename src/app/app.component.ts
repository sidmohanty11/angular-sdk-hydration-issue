import {
  Component,
  Input,
  ViewContainerRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Content, fetchOneEntry } from '@builder.io/sdk-angular';

// ====================================== this is the issue ================================================
@Component({
  selector: 'complete-component',
  standalone: true,
  template: `{{ label }}: <ng-content></ng-content>`,
})
export class CompleteComponent {
  @Input() label!: string;
}

@Component({
  selector: 'example',
  standalone: true,
  imports: [CommonModule],
  template: ` <ng-template #ahoj> hello<ng-content></ng-content></ng-template>
    <ng-container
      *ngComponentOutlet="
        CompleteComponent;
        inputs: myInputs;
        content: myContent
      "
    ></ng-container>`,
})
export class NgComponentOutletCompleteExample {
  CompleteComponent = CompleteComponent;

  myInputs = { label: 'Complete' };

  @ViewChild('ahoj', { static: true }) ahojTemplateRef!: TemplateRef<any>;
  myContent?: any[][];

  constructor(private vcr: ViewContainerRef) {}

  ngOnInit() {
    this.myContent = [
      this.vcr.createEmbeddedView(this.ahojTemplateRef).rootNodes,
    ];
  }
}

// =========================================================================================================

@Component({
  selector: 'app-root',
  standalone: true,
  // issue --------------------------------------------------------------------------------------------------------
  imports: [CommonModule, NgComponentOutletCompleteExample, CompleteComponent],
  template: ` <example /> `,
  // --------------------------------------------------------------------------------------------------------
  // template: `<builder-content
  //   model="page"
  //   apiKey="ad30f9a246614faaa6a03374f83554c9"
  //   [content]="content"
  // />`,
  // imports: [Content],
})
export class AppComponent {
  content = null as any;
}
