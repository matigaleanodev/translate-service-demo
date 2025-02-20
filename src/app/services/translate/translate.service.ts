import { DOCUMENT } from '@angular/common';
import {
  inject,
  Inject,
  Injectable,
  LOCALE_ID,
  Renderer2,
  RendererFactory2,
  signal,
} from '@angular/core';
import { enUS } from 'src/app/i18n/enUS';
import { esAR } from 'src/app/i18n/esAR';
import { ptBR } from 'src/app/i18n/ptBR';
import { Language } from 'src/app/model/language.model';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private store = inject(StorageService);
  private translations: { [key: string]: { [key: string]: string } } = {
    [Language.EN]: enUS,
    [Language.ES]: esAR,
    [Language.PT]: ptBR,
  };

  currentLang = signal<Language>(Language.ES);

  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  async initLang(): Promise<void> {
    const lang = await this.getStoredLang();
    this.setLanguage(lang);
  }

  async getStoredLang(): Promise<Language> {
    const storedLang = (await this.store.get('lang')) as Language;

    if (storedLang && Object.values(Language).includes(storedLang)) {
      return storedLang;
    }

    return Language.ES;
  }

  setLanguage(lang: Language): void {
    if (this.translations[lang]) {
      this.currentLang.set(lang);
      this.store.set('lang', lang);
      this.renderer.setAttribute(this.document.documentElement, 'lang', lang);
      this.setLocale(lang);
    }
  }

  private setLocale(lang: Language): void {
    const localeMap: { [key in Language]: string } = {
      [Language.EN]: 'en-US',
      [Language.ES]: 'es-AR',
      [Language.PT]: 'pt-BR',
    };

    const locale = localeMap[lang] || 'en-US';
    this.localeId = locale;
  }

  getCurrentLanguage(): Language {
    return this.currentLang();
  }

  instant(key: string): string {
    return this.translations[this.currentLang()][key] || key;
  }

  pipeTranslate(key: string, lang: Language) {
    return this.translations[lang][key] || key;
  }
}
