import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../main.component';

@Component({
  selector: 'app-theme-config',
  templateUrl: './theme-config.component.html',
  styleUrls: ['./theme-config.component.scss']
})
export class ThemeConfigComponent implements OnInit {

  componentThemes: any;
  themeColor = 'blue';

  constructor(public app: MainComponent) {
    this.componentThemes = [
      { name: 'Amber Accent', file: 'amber', color: '#FFC107' },
      { name: 'Blue Accent', file: 'blue', color: '#2196F3' },
      { name: 'Blue Gray Accent', file: 'bluegray', color: '#607D8B' },
      { name: 'Brown Accent', file: 'brown', color: '#795548' },
      { name: 'Cyan Accent', file: 'cyan', color: '#00BCD4' },
      { name: 'Deep Orange Accent', file: 'deeporange', color: '#FF5722' },
      { name: 'Deep Purple Accent', file: 'deeppurple', color: '#673AB7' },
      { name: 'Green Accent', file: 'green', color: '#4CAF50' },
      { name: 'Indigo Accent', file: 'indigo', color: '#3F51B5' },
      { name: 'Light Blue Accent', file: 'lightblue', color: '#03A9F4' },
      { name: 'Light Green Accent', file: 'lightgreen', color: '#8BC34A' },
      { name: 'Lime Accent', file: 'lime', color: '#CDDC39' },
      { name: 'Orange Accent', file: 'orange', color: '#FF9800' },
      { name: 'Pink Accent', file: 'pink', color: '#E91E63' },
      { name: 'Purple Accent', file: 'purple', color: '#9C27B0' },
      { name: 'Teal Accent', file: 'teal', color: '#00796B' },
      { name: 'Yellow Accent', file: 'yellow', color: '#FFEB3B' },
    ];
  }

  ngOnInit(): void {
  }

  changeTheme(theme: string) {
    this.changeStyleSheetsColor('theme-css', theme, 'theme-');
    this.changeStyleSheetsColor('layout-css', theme, 'layout-');
    this.themeColor = theme;

    const topbarLogo: HTMLImageElement = document.getElementById('layout-topbar-logo') as HTMLImageElement;
    const menuLogo: HTMLImageElement = document.getElementById('layout-menu-logo') as HTMLImageElement;

    if (theme === 'yellow' || theme === 'lime') {
      topbarLogo.src = 'assets/layout/images/logo-black.png';
      menuLogo.src = 'assets/layout/images/logo-black.png';
    } else {
      topbarLogo.src = 'assets/layout/images/logo-white.png';
      menuLogo.src = 'assets/layout/images/logo-white.png';
    }
  }

  changeStyleSheetsColor(id, value, prefix) {
    const element = document.getElementById(id);
    const urlTokens = element.getAttribute('href').split('/');
    urlTokens[urlTokens.length - 1] = prefix + value + '.css';
    const newURL = urlTokens.join('/');

    this.replaceLink(element, newURL);
  }

  isIE() {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
  }

  replaceLink(linkElement, href) {
    if (this.isIE()) {
      linkElement.setAttribute('href', href);
    } else {
      const id = linkElement.getAttribute('id');
      const cloneLinkElement = linkElement.cloneNode(true);

      cloneLinkElement.setAttribute('href', href);
      cloneLinkElement.setAttribute('id', id + '-clone');

      linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

      cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', id);
      });
    }
  }

  onConfigButtonClick(event) {
    this.app.configActive = !this.app.configActive;
    this.app.configClick = true;
    event.preventDefault();
  }
}