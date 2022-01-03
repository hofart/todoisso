export default class View {
  constructor() {}

  #todolist = []
  #id = Math.floor(Math.random() * 9999)

  #items = document.getElementById('items')
  #form = document.getElementById('task_editor')
  #btnAdd = document.getElementById('insert_task')
  #btnFilter = document.getElementById('filter')
  #openManagerContent = document.getElementById('open_manager_content')
  #closeManagerContent = document.getElementById('manager_content--cancel')
  #managerContent = document.getElementById('manager_content')

  #months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  #days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  addNewTask() {
    this.#btnAdd.addEventListener('click', () => {
      const { title, content } = this.#form

      if(!title.value.trim() || !content.value.trim()) return false

      this.#id++
      
      this.#todolist.push({
        title: title.value,
        content: content.value,
        id: this.#id,
        done: false
      })

      this.#form.reset()

      if(this.#todolist) {
        this.#items.style.display = 'block'

        this.createList(this.#items)
        this.deleteTask()
        this.doneOrUndone()
        this.filter()
      } else {
        this.#items.style.display = 'none'
      }
    })  
  }

  createList(ul) {
    const li = this.#todolist.map(item => `
      <li class="items__list" id="task-${item.id}">
        <div class="items__list__checkbox">
          <input type="checkbox" class="items__list__checkbox__input" data-id="${item.id}" ${item.done ? 'checked' : ''}>
          <div class="items__list__checkbox__body">
            <p class="items__list__checkbox__body__title title-list ${item.done ? 'done' : '' }">${item.title}</p>
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

    ul.innerHTML = li
  }

  doneOrUndone() {
    const nodes = this.#items.querySelectorAll('.items__list__checkbox__input')

    nodes.forEach(e => e.addEventListener('click', () => {
      const data = e.getAttribute('data-id')
      this.#todolist.findIndex(el => el.id == data && e.checked ? el.done = true : el.done = false)
      e.checked ? e.parentNode.lastElementChild.firstElementChild.classList.add('done') : e.parentNode.lastElementChild.firstElementChild.classList.remove('done')
    }))
  }

  filter() {
    this.#btnFilter.addEventListener('click', () => {
      const nodes = this.#items.querySelectorAll('.items__list__checkbox__input')
      
      nodes.forEach(e => e.checked ? e.parentNode.parentElement.style.display = 'flex' : e.parentNode.parentElement.style.display = 'none')
    })
  }

  deleteTask() {
    const nodes = this.#items.querySelectorAll('.items__list__delete--delete')  

    nodes.forEach(e => e.addEventListener('click', () => {
      const li = e.parentNode
      const data = e.getAttribute('data-id')
      this.#todolist.splice(this.#todolist.findIndex(el => el.id == data), 1)
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
    this.#openManagerContent.addEventListener('click', () => {
      this.#managerContent.style.display = 'block'
      this.#openManagerContent.style.opacity = '0'
    })

    this.#closeManagerContent.addEventListener('click', () => {
      this.#managerContent.style.display = 'none'
      this.#openManagerContent.style.opacity = '1'
    })
  }
  
  _init() {
    this.addNewTask()
    this.getDate()
    this.toggleManagerContent()
  }
}