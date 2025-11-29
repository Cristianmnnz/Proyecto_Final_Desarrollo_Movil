import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { AuthService } from '../../services/auth'; // o auth.service según tu archivo

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {}

  async onLogin() {
    const ok = this.auth.login(this.email, this.password);

    if (!ok) {
      const t = await this.toast.create({ message: 'Credenciales inválidas ❌', duration: 1500 });
      return t.present();
    }

    const t = await this.toast.create({ message: 'Login correcto ✅', duration: 1500 });
    await t.present();
    this.router.navigateByUrl('/profile');
  }
}
