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

import { Injectable } from '@angular/core';
import {
  BaTableOfContentsArea,
  BaScrollSpyElement,
} from '../scroll-spy/scroll-spy';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class BaScrollSpyService2 {
  activeItems: Observable<BaScrollSpyElement[]>;

  constructor(scrollSpy: BaTableOfContentsArea) {
    this.activeItems = scrollSpy.dominantItems
      .asObservable()
      .pipe(distinctUntilChanged());
  }
}
