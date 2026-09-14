export interface Usuario {
  id?: string;

  nombre: string;
  apellido?: string;
  usuario?: string;

  email: string;
  password: string;

  ciudad?: string;
  provincia?: string;

  rol: 'admin' | 'user';
}