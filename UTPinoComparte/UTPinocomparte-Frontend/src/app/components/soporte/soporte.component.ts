import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta a tu AuthService sea la correcta

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './soporte.component.html',
  styleUrl: './soporte.component.css'
})
export class SoporteComponent implements OnInit {
  private authService = inject(AuthService);

  @ViewChild('formSoporte') formSoporte!: NgForm;

  reporte = {
    tipoProblema: '',
    nombre: '',
    correo: '',
    telefono: '', 
    transaccion: '',
    desc_report: ''
  };

  archivos: File[] = [];
  errorArchivo = '';
  enviado = false;

  readonly tamanoMaximo = 5 * 1024 * 1024;

  ngOnInit(): void {
    // Autocompletamos nombre y correo del usuario autenticado
    this.authService.usuario$.subscribe({
      next: (user) => {
        if (user) {
          this.reporte.nombre = user.nom_usu || user.nombre || user.name || '';
          this.reporte.correo = user.correo || user.email || '';
        }
      }
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.agregarArchivos(Array.from(input.files));
    }

    input.value = '';
  }

  onFilesDropped(event: DragEvent): void {
    event.preventDefault();

    if (event.dataTransfer?.files) {
      this.agregarArchivos(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private agregarArchivos(nuevosArchivos: File[]): void {
    this.errorArchivo = '';

    for (const archivo of nuevosArchivos) {
      if (archivo.size > this.tamanoMaximo) {
        this.errorArchivo =
          `El archivo "${archivo.name}" supera el límite de 5 MB.`;
        continue;
      }

      const yaExiste = this.archivos.some(
        existente =>
          existente.name === archivo.name &&
          existente.size === archivo.size &&
          existente.lastModified === archivo.lastModified
      );

      if (!yaExiste) {
        this.archivos.push(archivo);
      }
    }
  }

  eliminarArchivo(indice: number): void {
    this.archivos.splice(indice, 1);
  }

  enviarReporte(formulario: NgForm): void {
    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    this.enviado = true;

    console.log('Datos del reporte:', this.reporte);
    console.log('Archivos seleccionados:', this.archivos);

    // Aquí posteriormente conectaremos con tu servicio para enviar los datos al backend (SoporteController)
  }

  nuevoReporte(): void {
    // Guardamos los datos de sesión para no perderlos al reiniciar el formulario
    const nombreActual = this.reporte.nombre;
    const correoActual = this.reporte.correo;

    this.reporte = {
      tipoProblema: '',
      nombre: nombreActual,
      correo: correoActual,
      telefono: '',
      transaccion: '',
      desc_report: ''
    };

    this.archivos = [];
    this.errorArchivo = '';
    this.enviado = false;

    if (this.formSoporte) {
      this.formSoporte.resetForm(this.reporte);
    }
  }
}