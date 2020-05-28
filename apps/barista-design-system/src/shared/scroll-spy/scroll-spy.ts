/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Component,
  ElementRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef,
  ComponentFactory,
  Injector,
  AfterViewInit,
  ViewChildren,
  QueryList,
  OnInit,
  AfterContentInit,
} from '@angular/core';
import { createComponent } from '../../utils/create-component';
import { ReplaySubject } from 'rxjs';

export interface BaScrollSpyElement {
  id: string;
  headlineElement: Element;
}

@Component({
  selector: 'h2[baTableOfContentSection], h3[baTableOfContentSection]',
  template: '<ng-content></ng-content>',
})
export class BaTableOfContentSection implements OnInit {
  sectionElement: Element;

  constructor(private _elementRef: ElementRef) {}

  ngOnInit(): void {
    this.sectionElement = this._elementRef.nativeElement;
  }
}

@Component({
  selector: '[baTableOfContentsArea]',
  template: '<ng-content></ng-content>',
})
export class BaTableOfContentsArea implements AfterContentInit, AfterViewInit {
  @ViewChildren('[baTableOfContentSection]')
  sections: QueryList<HTMLElement>;

  tableOfContentSectionsCompRef: ComponentRef<BaTableOfContentSection>[] = [];

  private _componentFactory: ComponentFactory<BaTableOfContentSection>;

  private _componentRefs: ComponentRef<any>[] = [];

  options = {
    root: null, // relative to document viewport
    rootMargin: '0px', // margin around root. Values are similar to css property. Unitless values not allowed
    threshold: 1.0, // visible amount of item shown in relation to root
  };

  observer = new IntersectionObserver(this.onChange, this.options);

  spyItems: BaScrollSpyElement[] = [];
  dominantItems = new ReplaySubject<BaScrollSpyElement[]>(1);

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _viewContainerRef: ViewContainerRef,
    private _injector: Injector,
  ) {}

  ngAfterContentInit(): void {
    this.createComponents();
  }

  ngAfterViewInit(): void {
    this._componentRefs.forEach((componentRef) => {
      this.observer.observe(componentRef.instance._elementRef.nativeElement);
      this.spyItems.push({
        id: (componentRef.instance._elementRef
          .nativeElement as HTMLElement).getAttribute('id')!,
        headlineElement: componentRef.instance._elementRef.nativeElement,
      });
    });
    // TODO: Create an object Subject(instead of only the element type) that contains the id.
    // Send that over to the service and then to the toc
    // and let the toc component compare the active item id with the toc item id to set the active style
    // * ---------------
    console.log(this._componentRefs[0]);
  }

  // TODO: Fetch all TOC sections and instantiate them dynamically for each headline.
  // TODO: Use Component Factory Resolver. UNDERSTAND IT THEN USE IT TO YOUR ADVANTAGE

  createComponents(): void {
    this._componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      BaTableOfContentSection,
    );
    const placeholderElements: HTMLElement[] = Array.from(
      this._elementRef.nativeElement.querySelectorAll(
        this._componentFactory.selector,
      ),
    );
    placeholderElements.forEach((el) => {
      const children = [].slice.call(el.childNodes);
      this._componentRefs.push(
        createComponent<BaTableOfContentSection>(
          this._componentFactory,
          this._viewContainerRef,
          this._injector,
          el,
          [...children],
        ),
      );
    });
  }

  // tslint:disable-next-line: typedef
  onChange(changes: IntersectionObserverEntry[], _observer): void {
    changes.forEach((change) => {
      if (change.intersectionRatio > 0) {
        this.spyItems.forEach((spyItem) => {
          if (spyItem.headlineElement === change.target) {
            this.dominantItems.next([spyItem]);
          }
        });
      }
    });
  }
}
