
import { QuestionState } from "../context/question.context"
import { AnswerLine } from "./AnswerLine"

export const QuestionnaireLine = (props) => {


    if (props.massiv && props.massiv.length!==0 && props.massiv.find((el) => {
        if(el===props.data.id_question) {
            return el
        }
    })) {
        return (
            <QuestionState>
                <div className="questionnaire-line-red">
                    <p>{props.data.text_question}</p>
                    {props.data.listAnswers.map(answer => {
                        return <AnswerLine question={props.data.text_question} answer={answer} key={answer.id_answer}/>
                    })}
                </div>
            </QuestionState>
        )
    }
    
    return (
        <QuestionState>
            <div className="questionnaire-line">
                <p>{props.data.text_question}</p>
                {props.data.listAnswers.map(answer => {
                    return <AnswerLine question={props.data.text_question} answer={answer} key={answer.id_answer}/>
                })}
            </div>
        </QuestionState>
    )
}