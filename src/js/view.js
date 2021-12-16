export default class View {
  constructor() {}

  #todolist = []
  #id = 1

  #items = document.getElementById('items')
  #li = document.querySelectorAll('task_list_item')
  #form = document.getElementById('task_editor')

  #btnAdd = document.getElementById('insert_task')

  addNewTask() {
    this.#btnAdd.addEventListener('click', () => {
      const { title, content } = this.#form

      if(!title.value.trim() || !content.value.trim()) return false

      //increment id and push value to array
      this.#id++

      this.#todolist.push({
        title: title.value,
        content: content.value,
        id: this.#id
      })

      console.log(this.#todolist)
      //clear input after submit
      this.#form.reset()
      //show div only if it has content
      this.#todolist ? this.#items.style.display = 'block' : this.#items.style.display = 'none'
      //calling methods
      this.createList(this.#todolist, this.#items)
      if(this.#todolist) this.deleteTask()
    })  
  }

  createList(list, ul) {
    if(list) {
      const li = this.#todolist.map(item => `
        <li class="task_list_item" id="task-${item.id}">
          <div class="task_list_item__checkbox">
            <input type="checkbox" class="task_list_item__input">
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