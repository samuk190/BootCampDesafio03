import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      height: Yup.number(),
      age: Yup.number().integer(),
      weight: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const StudentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (StudentExists) {
      return res.status(400).json({ error: 'Student already Exists' });
    }
    // mesmo face de middleware
    // const user = await User.create(req.body); // todos os dados
    // retornar para o front end
    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    // cadastro
    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    // console.log(req.userId);
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      height: Yup.number(),
      age: Yup.number().integer(),
      weight: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userId = req.params.id;
    const { email } = req.body;
    const student = await Student.findByPk(userId);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist!' });
    }

    if (email !== student.email) {
      const studentExists = await Student.findOne({
        where: { email },
      });
      if (studentExists) {
        return res.status(400).json({ error: 'Email already Exists' });
      }
    }

    const { name, age, weight, height } = await student.update(req.body);
    return res.json({
      userId,
      name,
      age,
      weight,
      height,
      email,
    });
  }
}

export default new StudentController();
