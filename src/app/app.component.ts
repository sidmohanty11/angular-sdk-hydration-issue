import {
  Component,
  Input,
  ViewContainerRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

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
  host: {
    ngSkipHydration: 'true',
  },
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
  selector: 'skip-hydration-wrapper',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    ngSkipHydration: 'true',
  },
})
export class SkipHydrationWrapper {}

@Component({
  selector: 'app-root',
  standalone: true,
  // issue --------------------------------------------------------------------------------------------------------
  imports: [
    CommonModule,
    NgComponentOutletCompleteExample,
    SkipHydrationWrapper,
  ],
  template: `
    <div>hello world</div>
    <div>
      <h1>hello world</h1>
      <skip-hydration-wrapper>
        <example> from inside</example>
      </skip-hydration-wrapper>
    </div>
    <!-- <example> from inside</example> -->
  `,
  // --------------------------------------------------------------------------------------------------------
  // template: `<builder-content
  //   model="page"
  //   apiKey="ad30f9a246614faaa6a03374f83554c9"
  //   [content]="content"
  // />`,
  // imports: [Content],
  // host: {
  //   ngSkipHydration: 'true',
  // },
})
export class AppComponent {
  content = null as any;
  // ngOnInit() {
  //   fetchOneEntry({
  //     model: 'page',
  //     apiKey: 'ad30f9a246614faaa6a03374f83554c9',
  //   }).then((content) => {
  //     this.content = content;
  //   });
  // }
}
