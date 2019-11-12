import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';
import { Op } from 'sequelize';
import { subDays, parseISO,  } from 'date-fns';
class HelpOrdersController {
  async noanswer(req,res){
    const { page = 1 } = req.query;
    const student_id = req.params.id;
    const helporders = await HelpOrder.findAll({
      attributes: ['id', 'student_id', 'created_at'],
      limit: 20,
      offset: (page - 1) * 20,
    },{ where:student_id, answer:null }
   );

    return res.json(helporders);

  }
  async index(req, res) {
    const { page = 1 } = req.query;
    const student_id = req.params.id;
    const helporders = await HelpOrder.findAll({
      attributes: ['id', 'student_id', 'created_at'],
      limit: 20,
      offset: (page - 1) * 20,
    },{ where:student_id }
   );
   return res.json(helporders);
  }
async answer(req,res){

  res.status(400);
}
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),


    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const student_id  = req.params.id;
    const question = req.body.question;

    // retornar para o front end
    const studentExists= await Student.findOne({where: {id: student_id}
    });
    if(!studentExists){
      //erro interno caso o usuário não tenha dado refresh
      //na pagina e tenha clicado em cadastrar com um plano
      // que ja foi deletado
      return res.status(400).json({error: 'Student does not exist'});
    }



    const helpOrderSave = await HelpOrder.create({question,student_id,answer_at: new Date()});




    // cadastro
    return res.json(helpOrderSave);
  }

}

export default new HelpOrdersController();
