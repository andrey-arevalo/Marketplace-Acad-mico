import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent implements OnInit {
  usuario: any = {
    nombre: 'Estudiante UTP',
    carrera: 'Ingeniería',
    ciclo: 8,
    articulosActivos: 0,
    reputacion: 5.0,
    avatar: 'Avatar-perfil-prueba.jpeg'
  };

  ngOnInit(): void {}
}
