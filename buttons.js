import { Markup } from 'telegraf'
import {questions_text} from './texts.js'

var general_menu = Markup.keyboard([
    ['Ծառայություններ', 'Հատուկ առաջարկ'], 
    ['Հաճախ տրվող հարցեր', 'Կապ մեզ հետ'], 
    ['Կապ սպասարկման բաժնի հետ',] 
])
.oneTime()
.resize()



var services = Markup.keyboard([
    ['Բրենդինգ/ռեբրենդինգ'],
    ['Գրաֆիկ և վեբ դիզայն'],
    ['Կայքերի պատրաստում'],
    ['Բիզնես ռազմավարություն և մարքեթինգ'],
    ['Թիրախավորում(ՍՄՄ)'],
    ['Ֆոտո/վիդեո նկարահանում'],
    ['Տպագրություն'],
    ['գլխավոր մենյու']
])
.oneTime()
.resize()



var questions = Markup.keyboard([
  [questions_text[0]], 
  [questions_text[1]], 
  ['գլխավոր մենյու'] 
])
.oneTime()
.resize()



var number = Markup.keyboard([
    [Markup.button.contactRequest('Կիսվել հեռախոսահամարով')],
    ['Գրել հեռախոսահամարը'],
    ['Հետ գնալ']
])
.resize()



export {general_menu, services, questions, number}
