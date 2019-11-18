import { Injectable } from '@angular/core';

@Injectable()
export class Downloader {
  download(fileName: string, content: Blob) {
    const element = document.createElement('a');
    const url = window.URL.createObjectURL(content);
    element.setAttribute('href', url);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(element);
  }
}
