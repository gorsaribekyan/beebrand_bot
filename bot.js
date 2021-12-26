import dotenv from 'dotenv'; dotenv.config()
import { Telegraf, Markup } from 'telegraf'
import fs from "fs";
import {general_menu, questions, services, number} from './buttons.js'
import {start_text, action_text, contact_text, after_req_text, answers, questions_text} from './texts.js'
const bot = new Telegraf(process.env.TOKEN)

const support_chat_id = process.env.SUPPORT_CHAT_ID

//bot.use(Telegraf.log())

// try{
	// 
// }catch(err){
    // console.log(err);
    // return
// }

var data;
function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
}
jsonReader("./data.json", (err, dataJSON) => {
  if (err) {
    console.log(err);
    return
  }
  data = dataJSON;
  console.log(data)
});


bot.start(async (ctx) => {
  try{
	await ctx.replyWithHTML(start_text, general_menu)
    data.users[ctx.from.id] = {'operator':false, 'phone_request':false, 'service_req':null} 
    await fs.writeFile('./data.json', JSON.stringify(data, undefined, 2), err => {if (err) {console.log('Error writing file', err)}})		
  }catch(err){
    console.log(err);
    return	
  }
})


bot.hears(['Ծառայություններ', 'Հետ գնալ'], async (ctx) => {
  try{
    await ctx.reply('Մեր ծառայությունները՝', services)
    data.users[ctx.from.id].operator = false 		
  }catch(err){
	console.log(err);
	return	
  }
})

const service_names = [
  'Բրենդինգ/ռեբրենդինգ',
  'Գրաֆիկ և վեբ դիզայն',
  'Կայքերի պատրաստում',
  'Բիզնես ռազմավարություն և մարքեթինգ',
  'Թիրախավորում(ՍՄՄ)',
  'Ֆոտո/վիդեո նկարահանում',
  'Տպագրություն'
]

bot.hears(service_names, async (ctx) => {
  try{
    await ctx.reply(ctx.message.text, Markup.inlineKeyboard([
    	Markup.button.callback('Ուղարկել հայտ', 'ban'),
  	]))
  	data.users[ctx.from.id].operator = false 
  	data.users[ctx.from.id].service_req = ctx.message.text	
  }catch(err){
    console.log(err);
    return	
  }
})

// 5073289691


bot.action(/.+/, (ctx) => {
  try{
    ctx.reply(action_text, number)
    data.users[ctx.from.id].phone_request = true 	
  }catch(err){
    console.log(err);
    return	
  }
})


bot.hears('Հատուկ առաջարկ', async (ctx) => {
  try{
    await bot.telegram.copyMessage(ctx.message.chat.id, support_chat_id, data.special_offer)
    data.users[ctx.from.id].operator = false 	
  }catch(err){
    console.log(err);
    return	
  }
})




bot.hears('Կապ սպասարկման բաժնի հետ', async (ctx) => {
  try{
    await ctx.reply('Գրեք ձեր հարցը այստեղ և սպասեք պատասխանի:)')
    data.users[ctx.from.id].operator = true	
  }catch(err){
    console.log(err);
    return	
  }
})


bot.hears('Կապ մեզ հետ', async (ctx) => {
  try{
    await ctx.reply(contact_text)
  	data.users[ctx.from.id].operator = false	
  }catch(err){
    console.log(err);
    return	
  }
})



bot.hears('Հաճախ տրվող հարցեր', async (ctx) => {
  try{
    await ctx.reply('Հաճախ տրվող հարցերը՝', questions)
    data.users[ctx.from.id].operator = false	
  }catch(err){
    console.log(err);
    return	
  }
})



bot.hears(questions_text[0], async (ctx) => {
  try{
    await ctx.reply(answers[0], questions)	
  }catch(err){
    console.log(err);
    return	
  }
})

bot.hears(questions_text[1], async (ctx) => {
  try{
    await ctx.reply(answers[1], questions)	
  }catch(err){
    console.log(err);
    return	
  }
})


bot.hears('գլխավոր մենյու', async (ctx) => {
  try{
    await ctx.reply('Գլխավոր մենյու՝', general_menu)	
  }catch(err){
    console.log(err);
    return	
  }
})


bot.hears('Գրել հեռախոսահամարը', async (ctx) => {
  try{
    await ctx.reply('Մուտքագրեք ձեր հեռախոսահամարը՝')	
  }catch(err){
      console.log(err);
      return	
  }
})


bot.hears(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g, async (ctx) => {
  try{
    if(data.users[ctx.from.id].phone_request){
  	  let message = `
#գործ_կա

${data.users[ctx.from.id].service_req}
  	
${ctx.message.text}
  	`
      await bot.telegram.sendMessage(support_chat_id, message)		
      await ctx.reply(after_req_text, services)
      data.users[ctx.from.id].phone_request = false 
  	}
  }catch(err){
    console.log(err);
    return	
  }
})	



bot.on('contact', async (ctx) => {
  try{
    await ctx.reply(after_req_text, services)
  	let message = `
#գործ_կա

${data.users[ctx.from.id].service_req}
  	
${ctx.message.contact.phone_number}
  	`
    await bot.telegram.sendMessage(support_chat_id, message)
  }catch(err){
      console.log(err);
      return
  }
})
 



bot.command('special', async (ctx) => {
  try{
  	 console.log(ctx.message)
  	if(ctx.message.from.id == '1319378597' || ctx.message.from.id == '5073289691'){
	  data.special_offer = ctx.message.reply_to_message.message_id
	  await fs.writeFile('./data.json', JSON.stringify(data, undefined, 2), err => {if (err) {console.log('Error writing file', err)}})
	  await bot.telegram.sendMessage(support_chat_id, 'OK')
	}else{
	  await bot.telegram.sendMessage(support_chat_id, 'NO')		
	}
  }catch(e){
    console.log(e)
	await bot.telegram.sendMessage(support_chat_id, 'NO')
	return
	}
})




bot.on('message', async (ctx) => {
  try{
  	if(ctx.message.chat.id == support_chat_id){
		try{      
	  		function getID(text){
	  			text = text.split("").reverse().join(""); 
	  			return text.slice(0, text.indexOf("DI")).split("").reverse().join("")
      		}
      		await bot.telegram.copyMessage(getID(ctx.message.reply_to_message.text), support_chat_id, ctx.message.message_id)
      		data.users[getID(ctx.message.reply_to_message.text)].operator = true
      		
      		//await fs.writeFile('./data.json', JSON.stringify(data, undefined, 2), err => {if (err) {console.log('Error writing file', err)}})
		} catch(err){
			console.log(err)
			return
		}
		return
	}
	if(data.users[ctx.from.id].operator &&  ctx.message.chat.id !== support_chat_id){
		let user_message = `
<b>${ctx.message.text}</b> 
		
<a href="tg://user?id=${ctx.message.chat.id}">${ctx.message.from.first_name ? ctx.message.from.first_name : "" } ${ctx.message.from.last_name ? ctx.message.from.last_name : ""} ${ctx.message.from.username ? '@'+ctx.message.from.username : "" } ID${ctx.message.from.id}</a>`
				
		await bot.telegram.sendMessage(support_chat_id, user_message, {parse_mode:'HTML'})
	}else{
		return
	}	
  }catch(err){
      console.log(err);
      return	
  }

})

function start(){
  try{
    bot.launch()
    console.log('[+] bot startred')
  }catch(err){
    console.log(err)
    return
  }
}

start()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
