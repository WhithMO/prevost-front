import { Component } from '@angular/core';
import { LoginService } from '../../../core/services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';
  primerIngresoRequerido = false;
  verPassword: boolean = false;

  claveActual = '';
  nuevaClave = '';
  confirmarClave = '';

  constructor(private loginService: LoginService, private router: Router) {}

  login() {
    if (!this.usuario || !this.contrasena) {
      Swal.fire({
        title: 'Campos Vacíos',
        text: 'Por favor, completa todos los campos.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#f39c12'
      });
      return;
    }

    this.loginService.login(this.usuario, this.contrasena).subscribe({
      next: (response) => {
        this.loginService.guardarDatosDeSesion(
          response.token,
          response.rol,
          response.usuario,
          response.idProfesor
        );
        if (response.rol === 'PROFESOR' && response.primerIngreso === false) {
          document.getElementById('btnAbrirModalClave')?.click();
          return;
        }
        
        
        Swal.fire({
          title: '¡Bienvenido!',
          text: 'Inicio de sesión exitoso.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          position: 'top-end'
        });

        setTimeout(() => {
          this.router.navigate(
            [response.rol === 'ADMINISTRADOR' ? '/inicio' : '/misclases']
          );
        }, 1600);
      },
      error: (error) => {
        console.error('❌ Error completo en login:', error);

        let mensaje = 'Ocurrió un error al iniciar sesión.';

        if (error.error?.error) mensaje = error.error.error;
        if (typeof error.error === 'string') mensaje = error.error;
        if (error.status === 403) mensaje = 'Usuario desactivado. Contacta al administrador.';
        else if (error.status === 401) mensaje = 'Credenciales incorrectas.';
        else if (error.status === 404) mensaje = 'Usuario no encontrado.';

        Swal.fire({
          title: 'Error en inicio de sesión',
          text: mensaje,
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  cambiarClave() {
    if (!this.claveActual || !this.nuevaClave || !this.confirmarClave) {
      Swal.fire('Error', 'Completa todos los campos.', 'warning');
      return;
    }
  
    if (this.nuevaClave !== this.confirmarClave) {
      Swal.fire('Error', 'Las nuevas contraseñas no coinciden.', 'warning');
      return;
    }
  
    const passwordValida = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(this.nuevaClave);
  
    if (!passwordValida) {
      Swal.fire(
        'Contraseña inválida',
        'La nueva contraseña debe tener al menos 8 caracteres, incluir una mayúscula y una minúscula.',
        'warning'
      );
      return;
    }
  
    const datos = {
      usuario: this.usuario,
      claveActual: this.claveActual,
      nuevaClave: this.nuevaClave
    };
  
    this.loginService.cambiarClave(datos).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Por favor, inicia sesión con tu nueva contraseña.',
          confirmButtonColor: '#3085d6'
        });
  
        this.claveActual = '';
        this.nuevaClave = '';
        this.confirmarClave = '';
        this.contrasena = '';
        this.primerIngresoRequerido = false;
  
        const modal = document.getElementById('modalCambioClave');
        const backdrop = document.querySelector('.modal-backdrop');
  
        if (modal) {
          modal.classList.remove('show');
          modal.setAttribute('aria-hidden', 'true');
          modal.removeAttribute('aria-modal');
          modal.style.display = 'none';
        }
  
        if (backdrop) {
          backdrop.remove();
        } 

        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        document.body.style.removeProperty('overflow');
      },
      error: (error) => {
        let mensaje = 'Error al actualizar la contraseña.';
        if (error.error?.error) mensaje = error.error.error;
  
        Swal.fire('Error', mensaje, 'error');
      }
    });
  }
  
  
}