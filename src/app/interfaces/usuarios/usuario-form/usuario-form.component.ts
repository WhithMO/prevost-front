import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { ProfesoresService } from '../../../core/services/profesores.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})

export class UsuarioFormComponent implements OnInit {
  usuarioForm!: FormGroup;
  listaProfesores: any[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuariosService,
    private profesorService: ProfesoresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarListas();
  }
  irAUsuarios() {
    this.router.navigate(['/usuarios']);
  }
  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      password: [''],
      /*password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      ]],*/
      idprofesor: [null, Validators.required]
    });
  }

  cargarListas(): void {
    let profesores: any[] = [];
    let usuarios: any[] = [];

    // Obtener la lista de profesores
    this.profesorService.listar().subscribe({
      next: (profesoresData) => {
        profesores = profesoresData;

        // Obtener la lista de usuarios registrados
        this.usuarioService.listar().subscribe({
          next: (usuariosData) => {
            usuarios = usuariosData;

            // Filtrar los profesores que NO tengan un usuario asignado
            this.listaProfesores = profesores.filter(profesor => 
              !usuarios.some(usuario => usuario.profesor?.idprofesor === profesor.idprofesor)
            );
          },
          error: (error) => {
            console.error('Error al cargar Usuarios:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar Profesores:', error);
      }
    });
  }

  guardarUsuario(): void {
    if (this.usuarioForm.invalid) {
      console.warn('Todos los campos son obligatorios.');
      return;
    }

    const usuarioData = {
      username: this.usuarioForm.value.username,
      password: this.usuarioForm.value.password,
      activo: 1,
      primerIngreso: 0,
      rol: { idrol: 2 },
      profesor: { idprofesor: this.usuarioForm.value.idprofesor }
    };

    this.usuarioService.agregar(usuarioData).subscribe({
      next: (response) => {
        console.log('Usuario guardado con éxito:', response);
        this.usuarioForm.reset();
        this.router.navigate(['/usuarios']);
      },
      error: (error) => {
        console.error('Error al guardar el usuario:', error);
      }
    });
  }
}