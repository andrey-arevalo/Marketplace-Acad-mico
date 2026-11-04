import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './soporte.component.html',
  styleUrl: './soporte.component.css'
})
export class SoporteComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  @ViewChild('formSoporte') formSoporte!: NgForm;

  usuarioIdLogueado: number | null = null;

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
  cargando = false;

  readonly tamanoMaximo = 5 * 1024 * 1024; // 5 MB

  ngOnInit(): void {
    // Si hay sesión iniciada, rellenamos el nombre y correo automáticamente
    this.authService.usuario$.subscribe({
      next: (user: any) => {
        if (user) {
          this.usuarioIdLogueado = user.id || user.usuarioid || null;
          this.reporte.nombre = user.nom_usu || user.nombre || user.name || '';
          this.reporte.correo = user.correo || user.email || '';
        }
      }
    });
  }

  // Capturamos los archivos seleccionados desde el botoncito
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.agregarArchivos(Array.from(input.files));
    }
    input.value = '';
  }

  // O si los arrastran a la zona de drop
  onFilesDropped(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.agregarArchivos(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // Validamos tamaño y que no estén repetidos
  private agregarArchivos(nuevosArchivos: File[]): void {
    this.errorArchivo = '';
    for (const archivo of nuevosArchivos) {
      if (archivo.size > this.tamanoMaximo) {
        this.errorArchivo = `El archivo "${archivo.name}" pesa más de 5 MB.`;
        continue;
      }
      const yaExiste = this.archivos.some(
        existente => existente.name === archivo.name && existente.size === archivo.size
      );
      if (!yaExiste) {
        this.archivos.push(archivo);
      }
    }
  }

  eliminarArchivo(indice: number): void {
    this.archivos.splice(indice, 1);
  }

  // Enviamos todo al backend de Laravel
  enviarReporte(formulario: NgForm): void {
    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    this.cargando = true;

    // Armamos el FormData porque mandamos textos y archivos juntos
    const formData = new FormData();
    if (this.usuarioIdLogueado) {
      formData.append('usuarioid', this.usuarioIdLogueado.toString());
    }
    formData.append('tipoProblema', this.reporte.tipoProblema);
    formData.append('nombre', this.reporte.nombre);
    formData.append('correo', this.reporte.correo);
    formData.append('telefono', this.reporte.telefono || '');
    formData.append('transaccion', this.reporte.transaccion || '');
    formData.append('desc_report', this.reporte.desc_report);

    if (this.archivos.length > 0) {
      formData.append('archivo', this.archivos[0]);
    }

    // Agregamos el token si está logueado
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const apiUrl = 'http://127.0.0.1:8000/api/soporte';

    // Petición POST hacia Laravel
    this.http.post(apiUrl, formData, { headers }).subscribe({
      next: (response: any) => {
        this.cargando = false;
        this.enviado = true;
        console.log('Todo bien, reporte guardado:', response);
      },
      error: (error) => {
        this.cargando = false;
        console.error('Falló el envío:', error);
        alert('Hubo un problema al enviar el reporte. Inténtalo de nuevo.');
      }
    });
  }

  // Limpiamos el formulario pero conservamos los datos del usuario
  nuevoReporte(): void {
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