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

import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FluidEasingType } from '@dynatrace/shared/barista-definitions';

@Component({
  selector: 'design-tokens-ui-easing-type-select',
  templateUrl: './easing-type-select.component.html',
  styleUrls: ['./easing-type-select.component.scss'],
})
export class DesignTokensUiEasingTypeSelectComponent {
  @Input() type: FluidEasingType = 'ease-in';
  @Input() exponent: number = 2;

  @Output() typeChange = new EventEmitter<FluidEasingType>();
  @Output() exponentChange = new EventEmitter<number>();
}
