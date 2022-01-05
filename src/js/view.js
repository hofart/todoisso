export default class View {
  constructor() {}

  #todolist = []
  #id = Math.floor(Math.random() * 9999)

  #items = document.getElementById('items')
  #btnAdd = document.getElementById('insert_task')
  #btnFilter = document.getElementById('filter')

  #months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  #days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  // add new task
  addNewTask() {
    this.#btnAdd.addEventListener('click', () => {
      const form = document.getElementById('task_editor')
      const { title, content } = form

      if(!title.value.trim() || !content.value.trim()) return false

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

        this.genereteTemplate(this.#items)
        this.deleteTask()
        this.doneOrUndone()
      } else {
        this.#items.style.display = 'none'
      }
    })
  }

  // create template html
  genereteTemplate(todo) {
    const template = this.#todolist.map(item => `
      <li class="items__list" id="task-${item.id}">
        <div class="items__list__checkbox">
          <input type="checkbox" class="items__list__checkbox__input" data-id="${item.id}" ${item.done ? 'checked' : ''}>
          <div class="items__list__checkbox__body">
            <p class="items__list__checkbox__body__title title-list ${item.done ? 'done' : ''}">${item.title}</p>
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

    todo.innerHTML = template
  }

  // check task as done or undone
  doneOrUndone() {
    const nodes = this.#items.querySelectorAll('.items__list__checkbox__input')
    nodes.forEach(element => element.addEventListener('click', () => {
      const data = element.getAttribute('data-id')
      const task = this.#todolist.find(todo => todo.id == data)
      element.checked ? task.done = true : task.done = false
    }))
  }

  deleteTask() {
    const nodes = this.#items.querySelectorAll('.items__list__delete--delete')  
    nodes.forEach(el => el.addEventListener('click', () => {
      const li = el.parentNode
      const data = el.getAttribute('data-id')
      this.#todolist.splice(this.#todolist.indexOf(el => el.id == data), 1)
      li.parentNode.remove()
    }))
  }

  getDate() {
    const date = new Date()
    document.getElementById('view__header__title').innerHTML = `
      Today ${date.getDate()} <span id="date">${this.#days[date.getDay()]} ${this.#months[date.getMonth()]}</span>
    `
  }

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
    this.getDate()
    this.toggleManagerContent()
  }
}