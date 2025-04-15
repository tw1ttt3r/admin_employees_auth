import { SignJWT, jwtVerify } from "jose";
import { TOKEN_KEY_SIGN, VALUE_PROTECTED_VERIFY, SALTROUNDS } from "#config/index.mjs";
import bcrypt from "bcrypt";

class Auth {

  #secret = '';

  constructor() {
    if (!TOKEN_KEY_SIGN) {
      throw new Error('SECRET KEY undefined!');
    }
    this.#secret = new TextEncoder().encode(TOKEN_KEY_SIGN);
  }

  async create(user, roles) {
    try {
      const token = await new SignJWT({ user, roles })
        .setProtectedHeader({ alg: 'HS256', verifier: VALUE_PROTECTED_VERIFY })
        .setIssuedAt()
        .sign(this.#secret);
  
      return token;
    } catch (error) {
      throw new Error('JWT no generado', error);
    }
  }

  async verify(token) {
    try {
      const { protectedHeader } = await jwtVerify(token, this.#secret);
      
      if (protectedHeader.verifier === VALUE_PROTECTED_VERIFY) {
        throw new Error('JWT no válido');
      }
  
      return true // Si todo está bien
    } catch (error) {
      throw new Error('JWT no válido')
    }
  }

  async createPassHash(password) {
    const saltConf = await bcrypt.genSalt(Number(SALTROUNDS));
    const hashPass = await bcrypt.hash(password, saltConf);
    return hashPass;
  };
  
  async comparePass(password, hashPass){
    const compare = await bcrypt.compare(password, hashPass);
    return compare
  };

}

export {
  Auth
}