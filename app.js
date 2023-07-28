const express=require('express')
const app=express()
const db=require('./models')
const Todo=db.Todo
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({extends:true}))
app.use(methodOverride('_method'))
app.use(session({
	secret: 'ThisIsSecret',
	resave: false,
	saveUninitialized: false
}))
app.use(flash())


app.get('/',(req,res)=>{
  res.redirect('/todos')
})

app.get('/todos',(req,res)=>{
  try { 
    // throw new Error('error' , 'error happened') !!主頁面設置通常會迴圈 
    return Todo.findAll({
    attributes: ['id', 'name','isDone'],
    raw: true 
    })
      .then((todos)=>{
      res.render('todos',{todos , message : req.flash('success')[0] || req.flash('deleted')[0] ||req.flash('error') })
      })
      .catch((err)=>{ 
        req.flash('error','資料取得發生問題 ')
        res.redirect('back')
      })
      
  }catch{
      req.flash('error','伺服器發生問題 ')
      res.redirect('back')
          }
})

app.get('/todos/new',(req,res)=>{
  try {
    // throw new Error('error' , 'error happened')
    return res.render('new', {message:req.flash('error')} )
  }catch {
    req.flash('error','伺服器發生問題 ')
    res.redirect('back')
  }
})

app.post('/todos',  (req, res) => {
	try {
    // throw new Error('error' , 'error happened')
		const name = req.body.name
		return  Todo.create({ name })
			.then(() => {
				req.flash('success', '新增成功!')
				return res.redirect('/todos')
			}).catch(()=>{
        req.flash('error', '新增失敗 請再試一次')
		    return res.redirect('back')
      })
	}catch (error) {
		console.error(error)
		req.flash('error', '伺服器發生問題')
		return res.redirect('back')
	}
})


app.get('/todos/:id', (req,res)=>{
  try {
    // throw new Error('error' , 'error happened')
    const id =req.params.id
      return Todo.findByPk(id,{
        attributes:['id','name','isDone'],
        raw:true
      }).then((todo)=>res.render('todo',{todo,message:req.flash('edited')[0] || req.flash('error')[0] }))
        .catch(()=>{
          req.flash('error' , "取得此項目時發生錯誤")
          res.redirect('back')
        })
  }catch{
    req.flash('error' , "伺服器發生問題")
    res.redirect('back')
  }
})


app.get('/todos/:id/edit',(req,res)=>{
  try{
    // throw new Error('error' , 'error happened')
    const id=req.params.id
      return Todo.findByPk(id,{
        attributes:['id','name','isDone'],
        raw:true
      }).then((todo)=>res.render('edit',{todo , message:req.flash('error')}))
      .catch(()=>{
        req.flash('error','取得編輯頁發生問題')
        res.redirect('back')
      })
  }catch{
      req.flash('error','伺服器發生問題')
      res.redirect('back')
  }
})


app.put('/todos/:id',(req,res)=>{
  try{
    // throw new Error('error' , 'error happened')
    const { name , isDone } =req.body
    const id=req.params.id
    return Todo.update(
        {
          name , 
          isDone : isDone ==='done'
        },{
        where : {id}
      }).then(()=>{
        req.flash('edited','編輯成功')
        res.redirect(`/todos/${id}`)
      }).catch(()=>{
        req.flash('error','更新項目發生問題')
        res.redirect('back')
      })
  }catch{
    req.flash('error','伺服器發生問題')
    res.redirect('back')
  }
})

app.delete('/todos/:id',(req,res)=>{
  try{
    // throw new Error('error' , 'error happened')
    const id=req.params.id
      return Todo.destroy({
        where:{id}
      }).then(()=>{
        req.flash('deleted','已刪除')
        res.redirect('/todos')
      }).catch(()=>{
        req.flash('error','刪除項目發生問題')
        res.redirect('back')
      })
  }catch{
    req.flash('error','伺服器發生問題')
    res.redirect('back')    
  }
})


app.listen(3000,()=>{
  console.log('Click : http://localhost:3000/')
})