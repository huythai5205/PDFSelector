import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
})
export class FetchDataComponent {
  PDF: any;
  PDFs: any = {};
  currentPage: number = 1;
  selectedPages: any[] = [];
  PDFZoom: string = 'auto';
  folderPath: string = '';
  PDFName: string = '';
  http: HttpClient;
  //baseUrl: string = 'http://localhost:5084/';
  baseUrl: string = 'http://localhost:81/';

  constructor(http: HttpClient) {
    this.http = http;
  }

  addPage(page: number) {
    this.selectedPages.push(page);
    this.selectedPages.sort((a, b) => a - b);
  }

  removePage(page: number) {
    this.selectedPages = this.selectedPages.filter(
      (element) => element !== page
    );
  }

  openModal() {
    const modalDiv = document.getElementById('myModal');

    if (modalDiv != null) {
      modalDiv.style.display = 'block';
    }
  }

  closeModal() {
    const modalDiv = document.getElementById('myModal');

    if (modalDiv != null) {
      modalDiv.style.display = 'none';
    }
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getPDFs() {
    this.PDFs = {};
    this.http.get(this.baseUrl + 'PDF/getPDFs').subscribe((res: any) => {
      res.forEach((path: any) => {
        const pathArr = path.split('\\');
        const pathArrLength = pathArr.length;
        const fileName = pathArr[pathArrLength - 1];
        const folderPath = pathArr.slice(0, -1).join('\\');
        if (this.PDFs[folderPath]) {
          const fileNames = [...this.PDFs[folderPath]];
          fileNames.push(fileName);
          this.PDFs[folderPath] = fileNames;
        } else {
          this.PDFs[folderPath] = [fileName];
        }
      });

      this.openModal();
    });
  }

  getSelectedPDF(folderPath: string, fileName: string) {
    this.http
      .get(
        this.baseUrl +
        'PDF/getPDF?folderPath=' +
        folderPath +
        '&fileName=' +
        fileName,
        {
          observe: 'response',
          responseType: 'blob',
        }
      )
      .subscribe((res: any) => {
        let tempBlob = res.body as Blob;
        const fileReader = new FileReader();
        fileReader.onload = () => {
          this.PDF = new Uint8Array(fileReader.result as ArrayBuffer);
        };
        fileReader.readAsArrayBuffer(tempBlob);

        this.folderPath = folderPath;
        this.PDFName = fileName;
        this.selectedPages = [];
        this.closeModal();
      });
  }

  saveDataToFile() {
    //const blob = new Blob([this.selectedPages.join('\n')], {
    //  type: 'text/plain;charset=utf-8',
    //});
    //saveAs(blob, 'review.txt');
    const body = { pages: JSON.stringify(this.selectedPages) };
    const headers = { 'content-type': 'application/json' };

    this.http
      .post(
        this.baseUrl + 'pdf?filePath=' + this.folderPath,
        this.selectedPages
      )
      .subscribe((res) => {
        alert('Saved to File');
      });
  }

  // onFileSelected() {
  //   let $img: any = document.querySelector('#file');

  //   if (typeof FileReader !== 'undefined') {
  //     let reader = new FileReader();

  //     reader.onload = (e: any) => {
  //       this.PDF = e.target.result;
  //     };

  //     reader.readAsArrayBuffer($img.files[0]);
  //     this.PDFName = $img.files[0].name;
  //     this.selectedPages = [];
  //   }
  // }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.PDF) {
      return;
    }
    event.preventDefault();
    if (event.key === ' ') {
      this.selectedPages.includes(this.currentPage)
        ? this.removePage(this.currentPage)
        : this.addPage(this.currentPage);
    } else if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      this.currentPage++;
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      this.currentPage--;
    }
  }
}
