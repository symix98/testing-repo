import { AfterViewInit, Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-signing-pad',
  templateUrl: './signing-pad.component.html',
  styleUrls: ['./signing-pad.component.scss']
})
export class SigningPadComponent implements OnInit, AfterViewInit {

  @Output() signatureEmitted = new EventEmitter<any>();
  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  signatureImg: string = null;
  signaturePadOptions: Object = {
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300
  };

  showPreview: boolean = false;
  disabled: boolean;

  constructor(private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.signaturePad.set('minWidth', 5);
    this.clearSignatureData();
    this.resizeCanvas();
  }

  drawComplete() {
  }

  drawStart() {
  }

  previewSignature() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    this.showPreview = true;
    this.disabled = this.signaturePad.isEmpty();
  }

  saveSignature() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to save signature?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.signatureEmitted.emit(this.signatureImg);
      },
      reject: () => {

      },
      key: "saveSignatureDialog"
    });
  }

  resizeCanvas() {
    const canvas = document.querySelector("canvas");
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    this.clearSignatureData();
  }

  clearSignatureData() {
    this.signaturePad.clear();
    this.signatureImg = null;
    this.showPreview = false;
  }
}
