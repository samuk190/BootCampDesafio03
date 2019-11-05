import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  // removido metodo de criacao pois admin nao podera se cadastrar
  // metodo update opcional
  async update(req, res) {
    // console.log(req.userId);
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),

      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);
    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res.status(400).json({ error: 'Email already Exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    const { id, name, provider } = await user.update(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
