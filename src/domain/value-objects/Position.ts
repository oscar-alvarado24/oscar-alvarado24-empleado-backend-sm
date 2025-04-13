export enum Position {
    DOCTOR ='DOCTOR',
    ASSITANT = 'ASSITANT',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    MEDICINE_DISPENSER = 'MEDICINE DISPENSER',
    DISPENSARY_MANAGER = 'DISPENSARY MANAGER'
}

export function stringToEnum(value: string): Position {
    if (Object.values(Position).includes(value as Position)) {
      return value as Position;
    }
    throw new Error(`El valor de "${value}" no es una opción válida para una posición`);
  }