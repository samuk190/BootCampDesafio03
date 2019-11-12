import * as Yup from 'yup';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';
import { addMonths, parseISO,  } from 'date-fns';
class RegistrationsController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const registrations = await Registration.findAll({
        //coloquei created_at pois é interessante saber quando foi realizado a matricula, e não somente a data de vigência
      attributes: ['id', 'student_id', 'plan_id', 'start_date','end_date','price','created_at'],
      limit: 20,
      offset: (page - 1) * 20,

    });

    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number()
              .required(),
      start_date: Yup.date().required(),

    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { student_id, plan_id, start_date } = req.body
    const planExists = await Plan.findOne({where: {id: req.body.plan_id}
    });

    if(!planExists){
      //erro interno caso o usuário não tenha dado refresh
      //na pagina e tenha clicado em cadastrar com um plano
      // que ja foi deletado
      return res.status(400).json({error: 'Plan does not exist'});
    }

    const studentExists= await Student.findOne({where: {id: student_id}
    });

    if(!studentExists){
      //erro interno caso o usuário não tenha dado refresh
      //na pagina e tenha clicado em cadastrar com um plano
      // que ja foi deletado
      return res.status(400).json({error: 'Student does not exist'});
    }
    const registrationExist = await Registration.findByPk(student_id);
    if (registrationExist) {
      return res
        .status(401)
        .json({ error: 'There is already an registration for this student' });
    }

    const {duration, price } = await Plan.findByPk(plan_id)
     const parsedStartDate = parseISO(start_date)
     const parsedEndDate = addMonths(parsedStartDate, duration)

    const totalprice = duration * price;

    const registrationSave = await Registration.create({student_id,plan_id,start_date,end_date:parsedEndDate, price: totalprice });

    return res.json(registrationSave) ;
    // cadastro

  }

  async update(req, res) {
    // console.log(req.userId);
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date(),

    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const registration = await Registration.findByPk(req.params.id);
    const { student_id, plan_id, start_date } = req.body
    const planExists = await Plan.findOne({where: {id: req.body.plan_id}
    });

    if(!planExists){
      //erro interno caso o usuário não tenha dado refresh
      //na pagina e tenha clicado em cadastrar com um plano
      // que ja foi deletado
      return res.status(400).json({error: 'Plan does not exist'});
    }

    const studentExists= await Student.findOne({where: {id: student_id}
    });

    if(!studentExists){
      //erro interno caso o usuário não tenha dado refresh
      //na pagina e tenha clicado em cadastrar com um plano
      // que ja foi deletado
      return res.status(400).json({error: 'Student does not exist'});
    }
    const registrationExist = await Registration.findByPk(student_id);

    if (registrationExist) {
      return res
        .status(401)
        .json({ error: 'There is already an registration for this student' });
    }
    const { duration, price } = await Plan.findByPk(plan_id)
    const parsedStartDate = parseISO(start_date)
    const parsedEndDate = addMonths(parsedStartDate, duration)

   const totalprice = duration * price;
   const registrationSave = await registration.update({student_id,plan_id,start_date,end_date:parsedEndDate, price: totalprice

   });
    return res.json(registrationSave);
  }
  async delete(req, res) {
    const registration = await Registration.destroy({
      where: {id: req.params.id},

    });

    return res.json(registration);
  }
}

export default new RegistrationsController();
