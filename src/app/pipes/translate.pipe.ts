import { computed, inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate/translate.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private _service: TranslateService = inject(TranslateService);

  currentLang = computed(() => this._service.currentLang());

  transform(value: string): string {
    return this._service.pipeTranslate(value, this.currentLang());
  }
}
