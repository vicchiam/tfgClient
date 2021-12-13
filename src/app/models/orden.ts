export interface Orden {

    id: number;
    tipo: number;
    solicitante_id: number;
    centro_id: number;
    ubicacion_id: number;
    ubicacion_nom?: string;
    maq_inst: number;
    maquina_id?: number;
    maquina_nom?: string;
    instalacion_id?: number;
    instalacion_nom?: string;
    averia: string;
    trabajo?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    parada?: number;
    estado?: number;
    razon?: string;

}
