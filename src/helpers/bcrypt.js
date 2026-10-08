import bcrypt from "bcrypt";

// Convierte la contraseña en un hash antes de guardarla. El número 10 indica
// el costo del proceso de cifrado; la contraseña original no se guarda.
export const hashPassword = async(password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
};

// Compara la contraseña que escribió la persona con el hash guardado en la base.
// Devuelve true si coincide y false si no coincide.
export const comparePassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}