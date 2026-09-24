import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-authmodal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './authmodal.html',
  styleUrl: './authmodal.css'
})
export class AuthModalComponent implements OnInit {
  ngOnInit() {
    console.log('¡ESTOY EN EL MODAL DE BIENVENIDA /AUTH!');
  }
}