import { METADATA } from "#db/metadata.mjs";

const DATOSPERSONALES = {
  IDUSUARIO: 'id_usuario',
  NOMBRE: 'nombre',
  APPATERNO: 'ap_paterno',
  APMATERNO: 'ap_materno',
  ALTA: 'alta',
  CORREO: 'correo',
  TELEFONO: 'telefono',
  ...METADATA
};

export {
  DATOSPERSONALES
}