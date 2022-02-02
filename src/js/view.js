export default class View {
  constructor() { }

  #todolist = []
  #categories = []

  #items = document.getElementById('items')
  #btnAdd = document.getElementById('add-task')
  #btnCategory = document.getElementById('add-category')
  #empty = document.getElementById('empty-figure')
  #filter = document.getElementById('wrapper-filter')

  #months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  #days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  #filterTypes = [
    { name: 'All', param: 'all', active: true },
    { name: 'Active', param: 'active', active: false },
    { name: 'Completed', param: 'completed', active: false }
  ]

  /**
   * @description add new task
   */

  addNewTask() {
    this.#btnAdd.addEventListener('click', () => {
      const form = document.getElementById('task-editor')
      const { title, content, category } = form

      if (!title.value.trim()) return false

      this.#todolist.push({
        title: title.value,
        content: content.value,
        id: Math.floor(Math.random() * 9999),
        done: false,
        category: category.value ? category.value : false
      })

      form.reset()

      if (this.#todolist) {
        this.todoUI(this.#todolist, this.#items)
        this.deleteTask()
        this.doneOrUndone()
        this.updateCount(this.#todolist)
        this.figure()
        this.filterUI()
      }
    })
  }

  /**
   * @description add new category
   */

  addNewCategory() {
    this.#btnCategory.addEventListener('click', () => {
      const form = document.getElementById('category-editor')
      const { title } = form

      if (!title.value.trim()) return false

      this.#categories.push({
        title: title.value,
        id: Math.floor(Math.random() * 9999),
        active: false
      })

      form.reset()

      if (this.#categories) {
        this.selectUI(this.#categories)
        this.categoryUI(this.#categories)
        this.filterByCategories()
      }
    })
  }

  /**
   * @description create template html of todolist
   * @param {Array<object>} todo
   * @param {ul} items
   * @returns {HTMLUListElement} list of itens
   */

  todoUI(todo, items) {
    items.innerHTML = todo.map(item => `
      <li class="view__list__task" id="task-${item.id}" ${item.category ? `data-category="${item.category}"` : ''}>
        <div class="view__list__task__checkbox">
          <input type="checkbox" class="view__list__task__checkbox__input" data-id="${item.id}" ${item.done ? 'checked' : ''}>
          <div class="view__list__task__checkbox__body">
            <p class="view__list__task__checkbox__body__title title-list ${item.done ? 'is--done' : ''}">${item.title}</p>
            <p class="view__list__task__checkbox__body__description">${item.content}</p>
            ${item.category ? `<small>Category: ${item.category}</small>` : ''}
          </div>
        </div>

        <div class="view__list__task__delete">
          <a href="#!" class="view__list__task__delete--delete" data-id="${item.id}">
            <i class="far fa-trash-alt"></i>
          </a>
        </div>
      </li>
    `).join('')
  }

  /**
   * @description create template html for categories
   * @param {Array<object>} category
   * @returns {HTMLAnchorElement} btn for categories
   */

  categoryUI(category) {
    document.getElementById('category').innerHTML = category.map(item => `
      <a href="#!" 
        class="view__categorie__category ${item.active ? 'is--active' : ''}" 
        data-id="${item.id}" 
        data-category="${item.title}" 
        data-active="${item.active}"
      >
        ${item.title}
      </a>
    `).join('')

    this.filterByCategories()
  }

  /**
   * @description render option of categories
   * @param {Array<object>} category
   * @returns {HTMLOptionElement} render option when i created categories
   */
  
  selectUI(category) {
    document.getElementById('get-categories').innerHTML = `
      <select class="manager-content__form__field" id="get-categories" name="category">
        <option value="" selected disable>Category</option>
        ${category.map(item => `<option value="${item.title}">${item.title}</option>`)}
      </select>
    `
  }

  /**
   * @description create filter template html
   * @returns {HTMLAnchorElement}
   */

  filterUI() {
    !this.#todolist.length ? this.#filter.style.display = 'none' : null

    this.#filter.innerHTML = this.#filterTypes.map(item => `
      <a
        href="#!" 
        class="view__filter__filtered ${item.active ? 'is--active' : ''}"
        data-param="${item.param}" 
        data-status="${item.active}"
      >
        ${item.name}
      </a>
    `).join('')

    this.activeFilter()
    this.filterByStatus()
  }

  /**
   * @description check task as done or undone
   */

  doneOrUndone() {
    const nodes = this.#items.querySelectorAll('.view__list__task__checkbox__input')

    nodes.forEach(el => el.addEventListener('click', () => {
      const id = el.getAttribute('data-id')
      const task = this.#todolist.find(todo => todo.id == id)

      if (el.checked) {
        task.done = true
        el.parentNode.lastElementChild.firstElementChild.classList.add('is--done')
      } else {
        task.done = false
        el.parentNode.lastElementChild.firstElementChild.classList.remove('is--done')
      }
    }))
  }

  /**
   * @description delete an item from array
   */

  deleteTask() {
    const nodes = this.#items.querySelectorAll('.view__list__task__delete--delete')

    nodes.forEach(el => el.addEventListener('click', () => {
      const id = el.getAttribute('data-id')

      this.#todolist.splice(this.#todolist.indexOf(el => el.id == id), 1)
      this.updateCount(this.#todolist)
      this.filterUI()
      this.figure()
      el.parentNode.parentNode.remove()
    }))
  }

  /**
   * @description set current date
   */

  setDate() {
    const date = new Date()
    const setDate = document.getElementById('title')

    setDate.innerHTML = `
      Today ${date.getDate()} <span id="date">${this.#days[date.getDay()]} - ${this.#months[date.getMonth()]}</span>
    `
  }

  /**
   * @description set total of tasks
   * @param {Array<object>} todos
   * @returns {length} total count
   */

  updateCount(todos) {
    return document.getElementById('count').innerHTML = `${todos.length} tasks`
  }

  /**
   * @description set class active
   */

  activeFilter() {
    const nodes = document.querySelectorAll('.view__filter__filtered')

    nodes.forEach(el => el.addEventListener('click', () => {
      const dataParam = el.getAttribute('data-param')
      const type = this.#filterTypes.find(item => item.param === dataParam)

      for (let key of this.#filterTypes) {
        key.active = false
        type.param == key.param ? key.active = true : null
      }

      this.filterUI()
    }))
  }

  /**
   * @description filter by categories
   */

  filterByCategories() {
    const nodes = document.querySelectorAll('.view__categorie__category')

    nodes.forEach(el => el.addEventListener('click', () => {
      const dataCategory = el.getAttribute('data-category')
      const category = this.#categories.find(item => item.title === dataCategory)
      const li = this.#items.querySelectorAll('li')

      for (let key of this.#categories) {
        key.active = false
        key.title === category.title ? key.active = true : null
      }

      li.forEach(el => el.getAttribute('data-category') === dataCategory ? el.style.display = 'flex' : el.style.display = 'none')

      this.categoryUI(this.#categories)
    }))
  }

  /**
   * @description filter by tasks
   */

  filterByStatus() {
    const nodes = document.querySelectorAll('.view__filter__filtered')

    nodes.forEach(el => el.addEventListener('click', () => {
      const dataParam = el.getAttribute('data-param')
      const li = this.#items.querySelectorAll('li')
      const inputSearch = document.getElementById('search').value

      this.filters(li, inputSearch, dataParam, null)
    }))
  }

  /**
   * @description search tasks and more
   */

  searchTask() {
    const input = document.getElementById('search')

    input.addEventListener('input', e => {
      const value = e.target.value
      const li = this.#items.querySelectorAll('li')
      const isActive = document.querySelector('.is--active').getAttribute('data-param')

      this.filters(li, value, isActive, null)
    })
  }

  /**
   * @description considering search bar when filter tasks
   * @param {HTMLLIElement} li
   * @param {string} value
   * @param {string} param
   * @param {string} category
   */

  filters(li, value, param, category) {
    li.forEach(el => {
      const textNode = el.firstElementChild.lastElementChild.firstElementChild.textContent
      const titleNode = el.firstElementChild.lastElementChild.firstElementChild
      const isDone = titleNode.classList.contains('is--done')

      console.log(category)

      el.style.display = 'none'

      this.#todolist.forEach(todo => {
        if (todo.title.includes(value) && textNode === todo.title) {
          el.style.display = 'flex'
        }

        if (todo.title.includes(value) && textNode === todo.title && isDone && param === 'active') {
          el.style.display = 'none'
        }

        if (todo.title.includes(value) && textNode === todo.title && !isDone && param === 'completed') {
          el.style.display = 'none'
        }
      })
    })
  }

  /**
   * @description show or hide element if have task
   * @returns {HTMLElement}
   */

  figure() {
    return this.#todolist.length < 1 ? this.#empty.style.display = 'block' : this.#empty.style.display = 'none'
  }

  /**
   * @description when click button to signup new task, control divs
   */

  toggleManagerContent() {
    const btnOpen = document.getElementById('open')
    const btnClose = document.getElementById('close')
    const managerContent = document.getElementById('manager-content')
    const openCategory = document.getElementById('open-category')
    const formTask = document.getElementById('task-editor')
    const formCategory = document.getElementById('category-editor')
    const select = document.getElementById('get-categories')

    btnOpen.addEventListener('click', () => {
      managerContent.style.display = 'block'
      btnOpen.style.opacity = '0'
      openCategory.style.opacity = '0'
      formCategory.style.display = 'none'
      formTask.style.display = 'flex'
      this.#btnCategory.style.display = 'none'
      this.#btnAdd.style.display = 'block'
      this.#categories.length ? select.style.display = 'block' : select.style.display = 'none'
    })

    openCategory.addEventListener('click', () => {
      managerContent.style.display = 'block'
      btnOpen.style.opacity = '0'
      openCategory.style.opacity = '0'
      formTask.style.display = 'none'
      formCategory.style.display = 'flex'
      this.#btnAdd.style.display = 'none'
      this.#btnCategory.style.display = 'block'
    })

    btnClose.addEventListener('click', () => {
      managerContent.style.display = 'none'
      btnOpen.style.opacity = '1'
      openCategory.style.opacity = '1'
    })
  }

  _init() {
    this.addNewTask()
    this.addNewCategory()
    this.setDate()
    this.toggleManagerContent()
    this.figure()
    this.searchTask()
  }
}