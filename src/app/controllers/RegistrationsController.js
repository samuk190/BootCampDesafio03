import * as Yup from 'yup';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';
import { addMonths, startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
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

    const { duration, price } = await Plan.findByPk(plan_id)
     const parsedStartDate = parseISO(start_date)
     const parsedEndDate = addMonths(parsedStartDate, duration)

    const totalprice = duration * price;

    //   const { id } = await Registration.create(
    //   req.body,{student_id,plan_id,start_date, end_date: parsedEndDate, price: 1 }
    // );
    const registrationSave = await Registration.create({student_id,plan_id,start_date:start_date,end_date:parsedEndDate, price: totalprice });

    return res.json({registrationSave}) ;
    // cadastro

  }

  async update(req, res) {
    // console.log(req.userId);
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number(),
       price: Yup.number(),

    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const planId = req.params.id;
    const { title, duration, price } = req.body;
    const plan = await Plan.findByPk(planId);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist!' });
    }

    if (plan !== plan.title) {
      const plantitleExists = await Plan.findOne({
        where: { title },
      });
      if (plantitleExists) {
        return res.status(400).json({ error: 'Plan title already Exists' });
      }
    }

    const { } = await plan.update(req.body);
    return res.json({
      title,
      duration,
      totalprice,

    });
  }
  async delete(req, res) {
    const plan = await Plan.destroy({
      where: {id: req.params.id},

    });


    // backgrounds em segundo plano

    return res.json(plan);
  }
}

export default new RegistrationsController();
