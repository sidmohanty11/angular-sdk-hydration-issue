import {
  Component,
  Input,
  ViewContainerRef,
  ViewChild,
  TemplateRef,
  ElementRef,
  Injector,
  ApplicationRef,
  ComponentRef,
  ComponentFactoryResolver,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PortalModule,
  ComponentPortal,
  CdkPortalOutlet,
  TemplatePortal,
} from '@angular/cdk/portal';
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

// @Component({
//   selector: 'example',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <ng-template #ahoj>hello<ng-content></ng-content></ng-template>
//     <div #container></div>
//   `,
// })
// export class NgComponentOutletCompleteExample {
//   @ViewChild('ahoj', { static: true }) ahojTemplateRef!: TemplateRef<any>;
//   @ViewChild('container', { static: true, read: ViewContainerRef })
//   containerRef!: ViewContainerRef;

//   constructor(private injector: Injector, private appRef: ApplicationRef) {}

//   ngOnInit() {
//     const componentRef = this.containerRef.createComponent(CompleteComponent, {
//       injector: this.injector,
//     });
//     componentRef.instance.label = 'Complete';

//     const embeddedView = this.ahojTemplateRef.createEmbeddedView({});
//     this.appRef.attachView(embeddedView);

//     const containerElement = componentRef.location.nativeElement;
//     embeddedView.rootNodes.forEach((node) =>
//       containerElement.appendChild(node)
//     );
//   }
// }

// PORTAL approach
// @Component({
//   selector: 'example',
//   standalone: true,
//   imports: [CommonModule, PortalModule],
//   template: `
//     <ng-template #ahoj> hello<ng-content></ng-content></ng-template>
//     <ng-container cdkPortalOutlet></ng-container>
//   `,
// })
// export class NgComponentOutletCompleteExample {
//   @ViewChild('ahoj', { static: true }) ahojTemplateRef!: TemplateRef<any>;
//   @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet!: CdkPortalOutlet;

//   constructor(private vcr: ViewContainerRef) {}

//   ngOnInit() {
//     const portal = new ComponentPortal(CompleteComponent);
//     const componentRef = this.portalOutlet.attachComponentPortal(portal);
//     componentRef.instance.label = 'Complete';

//     const templatePortal = new TemplatePortal(this.ahojTemplateRef, this.vcr);
//     this.vcr.createEmbeddedView(
//       templatePortal.templateRef,
//       templatePortal.context
//     );
//   }
// }

// =========================================================================================================

@Component({
  selector: 'app-root',
  standalone: true,
  // issue --------------------------------------------------------------------------------------------------------
  imports: [CommonModule, NgComponentOutletCompleteExample],
  template: ` <example> from inside</example> `,
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
  // ngOnInit() {
  //   fetchOneEntry({
  //     model: 'page',
  //     apiKey: 'ad30f9a246614faaa6a03374f83554c9',
  //   }).then((content) => {
  //     this.content = content;
  //   });
  // }
}
