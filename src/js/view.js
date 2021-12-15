export default class View {
  constructor() {}

  #todolist = []
  #id = 1

  #ul = document.getElementById('todolist')
  #input = document.getElementById('addNewTask')

  #btnAdd = document.getElementById('btn-add-task')
  #btnDelete = document.querySelectorAll('.btn-delete')

  addNewTask() {
    this.#btnAdd.addEventListener('click', () => {
      const obj = {
        name: this.#input.value,
        id: this.#id
      }

      this.#id++
      this.#todolist.push(obj)

      console.log(this.#todolist)

      //clear input after submit
      this.#input.value = ''
      //show div only if it has content
      this.#todolist ? this.#ul.style.display = 'block' : this.#ul.style.display = 'none'

      //calling methods
      this.createList(this.#todolist, this.#ul)
    })  
  }

  createList(list, ul) {
    if(list) {
      const li = this.#todolist.map(item => `
        <li class="wrapper" id="item-${item.id}">
          <div class="wrapper-content">
            <div class="item-checkbox">
              <input type="checkbox">
            </div>
            <div class="item-content">
              <p>${item.name}</p>
            </div>
          </div>
          <div class="item-trash">
            <a href="#!" class="delete">
              <i class="far fa-trash-alt"></i>
            </a>
          </div>
        </li>
      `).join('')

      ul.innerHTML = li
    }
  }

  deleteTask() {
    this.#ul.addEventListener('click', e => {
      if(e.target && e.target.classList.contains('btn-delete')) {

        //TODO: remove li and value from array
        console.log(e.target)
      }
    })
  }
  
  _init() {
    this.addNewTask()
    this.deleteTask()
  }
}