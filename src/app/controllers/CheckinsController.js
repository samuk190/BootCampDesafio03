import * as Yup from 'yup';
import Plan from '../models/Checkin';
import Student from '../models/Student';
import Checkin from '../models/Checkin';
import { Op } from 'sequelize';
import { subDays, parseISO,  } from 'date-fns';
class CheckinsController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const student_id = req.params.id;
    const checkins = await Checkin.findAll({
      attributes: ['id', 'student_id', 'created_at'],
      limit: 20,
      offset: (page - 1) * 20,
    },{ where:student_id}
   );

    return res.json(checkins);
  }

  async store(req, res) {
    // const schema = Yup.object().shape({
    //   student_id: Yup.number().required(),


    // });
    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Validation fails' });
    // }
    const student_id  = req.params.id;
    console.log(student_id);
    // const PlanExists = await Plan.findOne({
    //   where: { title: req.body.title },
    // });

    // if (PlanExists) {
    //   return res.status(400).json({ error: 'Plan already Exists' });
    // }

    // const user = await User.create(req.body); // todos os dados
    // retornar para o front end
    const studentExists= await Student.findOne({where: {id: student_id}
    });
    if(!studentExists){
      //erro interno caso o usuário não tenha dado refresh
      //na pagina e tenha clicado em cadastrar com um plano
      // que ja foi deletado
      return res.status(400).json({error: 'Student does not exist'});
    }

    const checkinPermit = await Checkin.findAndCountAll(
    {where: {student_id, created_at:{[Op.gte]:subDays(new Date(),7)}}}
    );

    if (checkinPermit.count >= 5) {
      return res.status(400).json({error: "You can have only 5 checkins in the past 7 days "})
    }

    const checkinSave = await Checkin.create({student_id});




    // cadastro
    return res.json(checkinSave);
  }

}

export default new CheckinsController();
