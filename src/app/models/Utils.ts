import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class Utils{
    public PENDIENTE: number = 0;
    public INICIADA: number = 1;
    public FINALIZADA: number = 2;
    public VALIDADA: number = 3;
    public RECHAZADA: number = 4;
    public DESCARTADA: number = 99;

    public CORRECTIVO: number = 1;
    public PREVENTIVO: number = 2;
    public MOVIMIENTO: number = 3;
    public MEJORA : number = 4;

    public LIMPIAR: number = 1099;
    public CANCELAR: number = 1098;
    public UBICACION: number = 1000;
    public MAQUINA: number = 1001;
    public INSTALACION: number = 1002;
    public PRODUCTO: number = 1003;

    public ANYADIR: number = 2001;
    public ACTUALIZAR: number = 2002;
    public ELIMINAR: number = 2003;    
}