import { METADATA } from "#db/metadata.mjs";

const DATOSPERSONALES = {
  IDUSUARIO: 'ID_USUARIO',
  NOMBRE: 'NOMBRE',
  APPATERNO: 'AP_PATERNO',
  APMATERNO: 'AP_MATERNO',
  ALTA: 'ALTA',
  CORREO: 'CORREO',
  TELEFONO: 'TELEFONO',
  ...METADATA
};

export {
  DATOSPERSONALES
}