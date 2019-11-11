import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.FLOAT,

      },
      {
        sequelize,
        // outras opcoes
      }
    );
    return this;
    // trechos de codigos que sao executados de forma automatica
    // funciona de forma automatica baseado em ações no model
  }
}
export default Plan;
