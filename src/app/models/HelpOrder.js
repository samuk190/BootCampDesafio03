import Sequelize, { Model } from 'sequelize';

class HelpOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        question:Sequelize.TEXT,
        answer:Sequelize.TEXT,
        answer_at:Sequelize.DATE,

      },
      {
        sequelize,
        // outras opcoes
      }
    );
    return this;
  }
  static associate(models) {
    //não a necessidade de colocar "as", mas deixei para não ter que escrever
    //caso haja mudanças nas associações que envolvam o uso dessas foreign keys.
       this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'Student' });
  }
}
export default HelpOrder;
