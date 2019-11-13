import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';
import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';
class HelpOrdersController {
  async noanswer(req,res){
    const { page = 1 } = req.query;
    const student_id = req.params.id;
    const helporders = await HelpOrder.findAll({
      attributes: ['id', 'student_id', 'created_at'],
      limit: 20,
      offset: (page - 1) * 20,
       where: {student_id, answer:null}
    },
   );

    return res.json(helporders);

  }
  async index(req, res) {
    const { page = 1 } = req.query;
    const student_id = req.params.id;
    const helporders = await HelpOrder.findAll({
      attributes: ['id', 'student_id', 'created_at','answer_at'],
      limit: 20,
      offset: (page - 1) * 20,
      where:{student_id: student_id}
    },
   );
   const studentExists= await Student.findOne({where: {id: student_id}
   });
   if(!studentExists){
     //erro interno caso o usuário não tenha dado refresh
     //na pagina e tenha clicado em cadastrar com um plano
     // que ja foi deletado
     return res.status(400).json({error: 'Student does not exist'});
   }
   return res.json(helporders);
  }
async answer(req,res){
 // console.log(req.userId);
 const schema = Yup.object().shape({
  answer: Yup.string().required(),

});
if (!(await schema.isValid(req.body))) {
  return res.status(400).json({ error: 'Validation fails' });
}

const answer = req.body.answer;
const id = req.params.id;


const helpOrderExist = await HelpOrder.findByPk(id);
const helpOrder = await HelpOrder.findByPk(req.params.id, { include: [
  {
    model: Student,
    as: 'student',
    attributes: ['id', 'email'],
  },
],
});

if (!helpOrderExist) {
  return res
    .status(401)
    .json({ error: 'Help Order not Found' });
}

await Queue.add(AnswerMail.key, {
  helpOrder,
});
const helpOrderSave = await helpOrder.update({answer,answer_at: new Date()

});
return res.json(helpOrderSave);

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



    const helpOrderSave = await HelpOrder.create({question,student_id});




    // cadastro
    return res.json(helpOrderSave);
  }

}

export default new HelpOrdersController();
