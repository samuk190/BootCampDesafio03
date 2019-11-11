import Sequelize, { Model } from 'sequelize';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {

        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.FLOAT,

      },
      {
        sequelize,
        // outras opcoes
      }
    );
    return this;

    // funciona de forma automatica baseado em ações no model
  }
  static associate(models) {
    //não a necessidade de colocar "as", mas deixei para não ter que escrever
    //caso haja mudanças nas associações que envolvam o uso dessas foreign keys.
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'Plan' });
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'Student' });
  }
}
export default Registration;
