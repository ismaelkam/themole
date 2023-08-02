import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { WordService } from 'src/app/word.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  rotationDegrees: number = 0;
  finalPosition: number = 30;
  endAnimation: boolean = true;

  constructor(
    private wordService: WordService,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) { }


  isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  startSpinner(){
      // Calcula una posición aleatoria entre 0 y 360 grados (giro completo)
      this.finalPosition = Math.random() * 360 * 8;
      this.rotationDegrees = 0;
      // Llama a la función para rotar gradualmente la flecha hasta la posición final
      this.rotateArrow();
  }

  rotateArrow() {
    this.endAnimation = false;
    const rotationSpeed = 45; // Velocidad de rotación (ajusta a tu preferencia)
    const rotationInterval = setInterval(() => {
      // Incrementa gradualmente los grados de rotación
      this.rotationDegrees += rotationSpeed;

      // Detiene la rotación si alcanza la posición final
      if (this.rotationDegrees >= this.finalPosition) {
        this.endAnimation = true;
        clearInterval(rotationInterval);
        this.rotationDegrees = this.finalPosition;
      }
    }, 50); // Intervalo de tiempo para la animación (ajusta a tu preferencia)
  }

  resetGame(){
    this.wordService.resetGame();
    this.router.navigate(['/']);
  }
}