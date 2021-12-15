export default class View {
  constructor() {}

  #todolist = []

  #ul = document.getElementById('todolist')
  #input = document.getElementById('addNewTask')

  #btnAdd = document.getElementById('btn-add-task')
  #btnDelete = document.querySelectorAll('.btn-delete')

  addNewTask() {
    this.#btnAdd.addEventListener('click', () => {
      const value = this.#input.value
      this.#todolist.push(value)

      //clear input after submit
      this.#input.value = ''
      //show div only if it has content
      this.#todolist ? this.#ul.display = 'block' : this.#ul.display = 'none'

      //calling methods
      this.createList(this.#todolist, this.#ul)
    })  
  }

  createList(list, ul) {
    if(list) {
      const li = this.#todolist.map(item => `
        <li class="wrapper-list">
          <div class="check-item">
            <input type="checkbox">
            ${item}
          </div>
          <div class="delete-item">
            <a class="btn-delete">
              x
            </div>
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