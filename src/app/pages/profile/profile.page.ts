import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { AuthService, User } from '../../services/auth'; 
// si tu servicio es auth.service.ts cambia el path

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProfilePage implements OnInit {

  user: User | null = null;
  profileImage: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    this.loadProfileImage();
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  // Cargar imagen guardada
  loadProfileImage() {
    this.profileImage = localStorage.getItem('profileImage');
  }

  // Guardar imagen
  saveProfileImage(dataUrl: string) {
    localStorage.setItem('profileImage', dataUrl);
    this.profileImage = dataUrl;
  }

  // Elegir opción (cámara o galería)
  async changePhoto() {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Foto de perfil',
      buttons: [
        {
          text: 'Tomar foto',
          icon: 'camera',
          handler: () => this.takePhoto(),
        },
        {
          text: 'Elegir de galería',
          icon: 'image',
          handler: () => this.pickFromGallery(),
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        }
      ]
    });

    await sheet.present();
  }

  // Tomar foto con cámara
  async takePhoto() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 90,
    });

    if (photo?.dataUrl) {
      this.saveProfileImage(photo.dataUrl);
    }
  }

  // Elegir desde galería
  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
      quality: 90,
    });

    if (photo?.dataUrl) {
      this.saveProfileImage(photo.dataUrl);
    }
  }
}
