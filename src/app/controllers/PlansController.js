import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlansController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const plans = await Plan.findAll({

      attributes: ['id', 'price', 'duration', 'title'],
      limit: 20,
      offset: (page - 1) * 20,

    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
              .required(),
      price: Yup.number().required(),

    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // const PlanExists = await Plan.findOne({
    //   where: { title: req.body.title },
    // });

    // if (PlanExists) {
    //   return res.status(400).json({ error: 'Plan already Exists' });
    // }

    // const user = await User.create(req.body); // todos os dados
    // retornar para o front end
    const { id, title, duration, price } = await Plan.create(
      req.body
    );

    // cadastro
    return res.json({
      id,
      title,
      duration,
      price,

    });
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
      planId,
      title,
      duration,
      price,

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

export default new PlansController();
