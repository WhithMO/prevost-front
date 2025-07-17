import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../../core/services/usuarios.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuario-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-editar.component.html',
  styleUrls: ['./usuario-editar.component.css']
})

export class UsuarioEditarComponent implements OnInit {
  usuarioForm: FormGroup;
  usuarioId!: number; // ID del usuario a editar
  username: string = ''; // Nombre de usuario (solo para mostrar)
  primerIngreso!: boolean; // Se mantiene sin cambios
  idprofesor!: number; // Se mantiene sin cambios
  nombreRol: string = '';

  listaRoles = [
    { idrol: 1, nombre: 'ADMINISTRADOR' },
    { idrol: 2, nombre: 'PROFESOR' }
  ]; // Lista de roles fija en el frontend

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuariosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      password: [''], // Ahora el campo no es obligatorio
      activo: [false, Validators.required], // Checkbox para el estado
      idrol: [null, Validators.required] // Select de roles
    });
  }

  ngOnInit(): void {
    this.usuarioId = Number(this.route.snapshot.params['idusuario']);
    console.log('ID del usuario:', this.usuarioId);
  
    if (this.usuarioId === 1) {
      // Mostrar alerta o redirigir
      Swal.fire({
        icon: 'warning',
        title: 'Acceso no permitido',
        text: 'Este usuario no puede ser editado.',
        confirmButtonText: 'Volver'
      }).then(() => {
        this.router.navigate(['/usuarios']);
      });
      return;
    }
  
    this.obtenerUsuario(this.usuarioId);
  }
  

  irAUsuarios() {
    this.router.navigate(['/usuarios']);
  }
  obtenerUsuario(id: number): void {
    this.usuarioService.buscaridNumber(id).subscribe({
      next: (usuario) => {
        if (usuario) {
          console.log('Usuario encontrado:', usuario);
          this.username = usuario.username; // Guarda el username para mostrarlo
          this.primerIngreso = usuario.primerIngreso; // Se mantiene sin cambios
          this.idprofesor = usuario.profesor?.idprofesor || null; // Se mantiene sin cambios
          
          this.usuarioForm.patchValue({
            
            username: usuario.username,
            activo: usuario.activo,
            idrol: usuario.rol?.idrol || null
          });
          this.nombreRol = this.listaRoles.find(r => r.idrol === usuario.rol?.idrol)?.nombre || '';
        } else {
          console.error('Usuario no encontrado.');
        }
      },
      error: (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    });
  }

  actualizarUsuario(): void {
    if (this.usuarioForm.invalid) {
      console.warn('Todos los campos obligatorios, excepto la clave.');
      return;
    }
  
    // Construimos el objeto sin modificar `primerIngreso` ni `idprofesor`
    const usuarioActualizado: any = {
      username: this.usuarioForm.value.username,
      activo: this.usuarioForm.value.activo,
      primerIngreso: this.primerIngreso, // Se mantiene igual
      rol: { idrol: this.usuarioForm.value.idrol },
      profesor: { idprofesor: this.idprofesor } // Se mantiene igual
    };

    // Si el usuario ingresó una clave, se la agregamos
    if (this.usuarioForm.value.password) {
      usuarioActualizado.password = this.usuarioForm.value.password;
      this.primerIngreso = false;
      usuarioActualizado.primerIngreso = this.primerIngreso;
    }

    console.log('Datos a enviar:', usuarioActualizado); // Depuración
  
    this.usuarioService.editar(this.usuarioId, usuarioActualizado).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Usuario actualizado con éxito.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/usuarios']); // Redirige después de aceptar
        });
      },
      error: (error) => {
        console.error('Error al actualizar el usuario:', error);
        const mensajeError = error.error?.message || 'Error desconocido';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensajeError,
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
}