import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ClrIconCustomTag } from './icon';

export const CLR_ICON_DIRECTIVES: Type<any>[] = [ClrIconCustomTag];

@NgModule({ imports: [CommonModule], declarations: [CLR_ICON_DIRECTIVES], exports: [CLR_ICON_DIRECTIVES] })
export class ClrIconModule {}
