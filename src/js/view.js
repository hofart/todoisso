export default class View {
  constructor() {}

  #todolist = []
  #id = Math.floor(Math.random() * 9999)

  #items = document.getElementById('items')
  #btnAdd = document.getElementById('insert_task')
  #empty = document.getElementById('empty-figure')
  #filter = document.getElementById('wrapper_filter')

  #months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  #days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  #filterTypes = [
    { name: 'All', param: 'all', active: true },
    { name: 'Active', param: 'active', active: false },
    { name: 'Completed', param: 'completed', active: false }
  ]

  // add new task
  addNewTask() {
    this.#btnAdd.addEventListener('click', () => {
      const form = document.getElementById('task_editor')
      const { title, content } = form

      if(!title.value.trim()) return false

      this.#id++

      this.#todolist.push({
        title: title.value,
        content: content.value,
        id: this.#id,
        done: false
      })

      form.reset()

      if(this.#todolist) {
        this.#items.style.display = 'block'

        // calling methods
        this.todoUI(this.#todolist, this.#items)
        this.deleteTask()
        this.doneOrUndone()
        this.updateCount(this.#todolist)
        this.figure()
        this.filter()
      } else {
        this.#items.style.display = 'none'
      }
    })
  }

  // create template html
  todoUI(todo, items) {
    const ui = todo.map(item => `
      <li class="items__list" id="task-${item.id}">
        <div class="items__list__checkbox">
          <input type="checkbox" class="items__list__checkbox__input" data-id="${item.id}" ${item.done ? 'checked' : ''}>
          <div class="items__list__checkbox__body">
            <p class="items__list__checkbox__body__title title-list ${item.done ? 'is--done' : ''}">${item.title}</p>
            <p class="items__list__checkbox__body__description">${item.content}</p>
          </div>
        </div>
        <div class="items__list__delete">
          <a href="#!" class="items__list__delete--delete" data-id="${item.id}">
            <i class="far fa-trash-alt"></i>
          </a>
        </div>
      </li>
    `).join('')

    return items.innerHTML = ui
  }

  // check task as done or undone
  doneOrUndone() {
    const nodes = this.#items.querySelectorAll('.items__list__checkbox__input')

    nodes.forEach(el => el.addEventListener('click', () => {
      const id = el.getAttribute('data-id')
      const task = this.#todolist.find(todo => todo.id == id)

      if(el.checked) {
        task.done = true
        el.parentNode.lastElementChild.firstElementChild.classList.add('is--done')
      } else {
        task.done = false
        el.parentNode.lastElementChild.firstElementChild.classList.remove('is--done')
      }
    }))
  }

  // delete an item from array
  deleteTask() {
    const nodes = this.#items.querySelectorAll('.items__list__delete--delete')

    nodes.forEach(el => el.addEventListener('click', () => {
      const li = el.parentNode
      const id = el.getAttribute('data-id')

      this.#todolist.splice(this.#todolist.indexOf(el => el.id == id), 1)
      this.updateCount(this.#todolist)
      this.figure()
      li.parentNode.remove()
    }))
  }

  // set current date
  setDate() {
    const date = new Date()
    const setDate = document.getElementById('view__header__title')

    return setDate.innerHTML = `
      Today ${date.getDate()} <span id="date">${this.#days[date.getDay()]} - ${this.#months[date.getMonth()]}</span>
    `
  }

  // set total of tasks
  updateCount(todo) {
    return document.getElementById('count').innerHTML = `${todo.length}`
  }

  filterUI() {
    const ui = this.#filterTypes.map(item => `
      <a
        href="#!" 
        class="view__header__filter__filtered ${item.active ? 'is--active' : ''}" 
        data-param="${item.param}" 
        data-status="${item.active}"
      >
        ${item.name}
      </a>
    `).join('')

    this.#filter.innerHTML = ui

    this.activeFilter()
    this.filter()
  }

  activeFilter() {
    const nodes = document.querySelectorAll('.view__header__filter__filtered')

    nodes.forEach(el => el.addEventListener('click', () => {
      const dataParam = el.getAttribute('data-param')
      const type = this.#filterTypes.find(i => i.param == dataParam)

      for(let key of this.#filterTypes) {
        key.active = false
        type.param == key.param ? key.active = true : null
      }

      this.filterUI()
    }))
  }

  // filter tasks NEED REFACTORING
  filter() {
    const nodes = document.querySelectorAll('.view__header__filter__filtered')

    nodes.forEach(el => el.addEventListener('click', () => {
      const dataParam = el.getAttribute('data-param')
      const li = this.#items.querySelectorAll('li')

      if(dataParam == 'all') {
        li.forEach(el => el.style.display = 'flex')
      }

      if(dataParam == 'active') {
        li.forEach(el => {
          const active = el.firstElementChild.lastElementChild.firstElementChild
          active.classList.contains('is--done') ? el.style.display = 'none' : el.style.display = 'flex'
        })
      }

      if(dataParam == 'completed') {
        li.forEach(el => {
          const completed = el.firstElementChild.lastElementChild.firstElementChild
          completed.classList.contains('is--done') ? el.style.display = 'flex' : el.style.display = 'none'
        })
      }
    }))
  }

  // show img with dont have task
  figure() {
    return this.#todolist.length < 1 ? this.#empty.style.display = 'block' : this.#empty.style.display = 'none'
  }

  // control divs
  toggleManagerContent() {
    const open = document.getElementById('open_manager_content')
    const close = document.getElementById('manager_content--cancel')
    const content = document.getElementById('manager_content')

    open.addEventListener('click', () => {
      content.style.display = 'block' 
      open.style.opacity = '0'
    })

    close.addEventListener('click', () => {
      content.style.display = 'none'
      open.style.opacity = '1'
    })
  }
  
  _init() {
    this.addNewTask()
    this.setDate()
    this.toggleManagerContent()
    this.figure()
    this.filterUI()
  }
}