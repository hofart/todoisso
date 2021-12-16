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

      // if any input field is empty, cant submit
      if(!title.value.trim() || !content.value.trim()) return false

      //increment id and push value to array
      this.#id++

      this.#todolist.push({
        title: title.value,
        content: content.value,
        id: this.#id
      })

      //clear input after submit
      this.#form.reset()
      //show div only if it has content
      this.#todolist ? this.#items.style.display = 'block' : this.#items.style.display = 'none'
      //calling methods
      this.createList(this.#todolist, this.#items)
      this.deleteTask(this.#todolist)
      this.checkTask(this.#todolist)
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

  checkTask(list) {
    if(list) {
      const nodes = this.#items.querySelectorAll('.task_list_item__input')

      nodes.forEach(e => e.addEventListener('click', () => {
        let styles = `
          text-decoration: line-through;
          font-style: italic;
        `
        let noStyles = `
          text-decoration: none;
          font-style: none;
        `

        // if input:checked set some styles
        if(e.checked) {
          e.parentNode.lastElementChild.firstElementChild.style = styles
          e.parentNode.lastElementChild.lastElementChild.style = styles
        } else {
          e.parentNode.lastElementChild.firstElementChild.style = noStyles
          e.parentNode.lastElementChild.lastElementChild.style = noStyles
        }
      }))
    }
  }

  deleteTask(list) {
    if(list) {
      const nodes = this.#items.querySelectorAll('.delete_task')  

      // add envent click on all delete button
      nodes.forEach(e => e.addEventListener('click', () => {
        // back to father element and get data-attr
        const li = e.parentNode
        const data = e.getAttribute('data-id')

        //find element in array and remove, remove li also
        this.#todolist.splice(this.#todolist.findIndex(el => el.id == data), 1)
        li.parentNode.remove()
      }))
    }
  }
  
  _init() {
    this.addNewTask()
  }
}