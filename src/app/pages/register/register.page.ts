import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth'; 
// si tu servicio se llama auth.service.ts cambia a '../../services/auth.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class RegisterPage {

  name = '';
  age: number | null = null;
  sex = '';
  email = '';
  password = '';

  // ✅ AQUÍ agregas el constructor
  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {}

  async onRegister() {
    if (!this.name || !this.age || !this.sex || !this.email || !this.password) {
      return this.showToast('Completa todos los campos');
    }

    if (this.age <= 0) {
      return this.showToast('Edad inválida');
    }

    this.auth.register({
      name: this.name,
      age: this.age,
      sex: this.sex,
      email: this.email,
      password: this.password
    });

    await this.showToast('Usuario registrado ✅');
    this.router.navigateByUrl('/login');
  }

  // ✅ método para el link del HTML
  goLogin() {
    this.router.navigateByUrl('/login');
  }

  async showToast(msg: string) {
    const t = await this.toast.create({ message: msg, duration: 1500 });
    t.present();
  }
}
