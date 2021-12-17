export default class View {
  constructor() {}

  #todolist = []
  #id = Math.floor(Math.random() * 9999)

  #items = document.getElementById('items')
  #li = document.querySelectorAll('task_list_item')
  #form = document.getElementById('task_editor')
  #btnAdd = document.getElementById('insert_task')

  addNewTask() {
    this.#btnAdd.addEventListener('click', () => {
      const { title, content } = this.#form

      if(!title.value.trim() || !content.value.trim()) return false

      this.#id++

      this.#todolist.push({
        title: title.value,
        content: content.value,
        id: this.#id,
        done: 'false'
      })

      this.#form.reset()

      if(this.#todolist) {
        this.#items.style.display = 'block'

        this.createList(this.#items)
        this.deleteTask()
        this.doneOrUndone()
      } else {
        this.#items.style.display = 'none'
      }
    })  
  }

  createList(ul) {
    const li = this.#todolist.map(item => `
      <li class="task_list_item" id="task-${item.id}">
        <div class="task_list_item__checkbox">
          <input type="checkbox" class="task_list_item__input" data-id="${item.id}" ${item.done == 'true' ? 'checked' : ''}>
          <div class="task_list_item__checkbox--body">
            <p class="task_list_item__input--title">${item.title}</p>
            <p class="task_list_item__input--description">${item.content}</p>
          </div>
        </div>
        <div class="task_list_item__delete">
          <a href="#!" class="delete_task" data-id="${item.id}">
            <i class="far fa-trash-alt"></i>
          </a>
        </div>
      </li>
    `).join('')

    ul.innerHTML = li
  }

  doneOrUndone() {
    const nodes = this.#items.querySelectorAll('.task_list_item__input')

    nodes.forEach(e => e.addEventListener('click', () => {
        const data = e.getAttribute('data-id')
        this.#todolist.findIndex(el => {
          el.id == data && e.checked ? el.done = 'true' : el.done = 'false'
        })
    }))
  }

  deleteTask() {
    const nodes = this.#items.querySelectorAll('.delete_task')  

    nodes.forEach(e => e.addEventListener('click', () => {
      const li = e.parentNode
      const data = e.getAttribute('data-id')
      this.#todolist.splice(this.#todolist.findIndex(el => el.id == data), 1)
      li.parentNode.remove()
    }))
  }
  
  _init() {
    this.addNewTask()
  }
}