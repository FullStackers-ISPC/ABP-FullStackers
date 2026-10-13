export interface Usuario {
  id_usuario?: number;
  email: string;
  password?: string;
  nombre: string;
  apellido: string;
  ciudad?: string;
  provincia?: string;
  id_rol: number;
  rol?: string;         
  rol_nombre?: string;  
  activo?: boolean;
}

export interface LoginResponse {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}