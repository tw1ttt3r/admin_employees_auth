import { SignJWT, jwtVerify } from "jose";
import { TOKEN_KEY_SIGN, VALUE_PROTECTED_VERIFY } from "#config/index.mjs";

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

}

export {
  Auth
}