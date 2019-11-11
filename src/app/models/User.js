import Sequelize, { Model } from 'sequelize';

import bcrypt from 'bcryptjs'; // hash

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        // so colunas inseridas no usuario
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
        // outras opcoes
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
    // trechos de codigos que sao executados de forma automatica
    // funciona de forma automatica baseado em ações no model
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;
