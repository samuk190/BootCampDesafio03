import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  // recebe e bota tudo!
  async handle({ data }) {
    const { helpOrder } = data;
    // console.log('A FILA EXECUTOU');
    await Mail.sendMail({
      to: `${helpOrder.student.id} <${helpOrder.student.email}`,
      subject: 'Resposta ao seu pedido de auxilio',
      // text: 'Voce tem um novo cancelamento',
      template: 'answeration',
      // enviar todas as variaveis pro template do mail
      context: {
        student: helpOrder.student.id,
        answer: helpOrder.answer,
        question: helpOrder.question,
        answer_at: format(
          parseISO(helpOrder.answer_at),
          "'dia' dd 'de' MMMM,'ás' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
      // created: format(
      //   parseISO(helpOrder.created_at),
      //   "'dia' dd 'de' MMMM,'ás' H:mm'h'",
      //   {
      //     locale: pt,
      //   }
      // ),

    });
  }
}
export default new AnswerMail();
// import cancellation mail from

// cancelatiionmail.key
