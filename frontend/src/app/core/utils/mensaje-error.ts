import { HttpErrorResponse } from '@angular/common/http';

// Convierte la respuesta de error del backend en un texto para mostrar al usuario.
export function obtenerMensajeError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verificá que el backend esté en ejecución.';
    }

    const cuerpo = error.error;
    if (cuerpo && typeof cuerpo === 'object') {
      if (typeof cuerpo.detail === 'string') return cuerpo.detail;
      if (typeof cuerpo.error === 'string') return cuerpo.error;

      const mensajes = Object.entries(cuerpo).map(
        ([campo, valor]) => `${campo}: ${Array.isArray(valor) ? valor.join(' ') : valor}`
      );
      if (mensajes.length) return mensajes.join(' | ');
    }
    return `El servidor respondió con el código ${error.status}.`;
  }
  return 'Ocurrió un error inesperado. Intentá nuevamente.';
}