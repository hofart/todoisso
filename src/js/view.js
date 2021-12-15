export default class View {
  constructor() {}

  #todolist = []
  #id = 1

  #items = document.getElementById('items')
  #form = document.getElementById('task_editor')

  #btnAdd = document.getElementById('insert_task')
  #btnDelete = document.querySelectorAll('.delete_task')

  addNewTask() {
    this.#btnAdd.addEventListener('click', () => {
      const { title, content } = this.#form

      const values = {
        title: title.value,
        content: content.value,
        id: this.#id
      }
      
      this.#id++
      this.#todolist.push(values)

      console.log(this.#todolist)

      //clear input after submit
      title.value = ''
      content.value = ''
      //show div only if it has content
      this.#todolist ? this.#items.style.display = 'block' : this.#items.style.display = 'none'

      //calling methods
      this.createList(this.#todolist, this.#items)
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
            <a href="#!" class="delete_task">
              <i class="far fa-trash-alt"></i>
            </a>
          </div>
        </li>
      `).join('')

      ul.innerHTML = li
    }
  }

  // deleteTask() {}
  
  _init() {
    this.addNewTask()
    // this.deleteTask()
  }
}