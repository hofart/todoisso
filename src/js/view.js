export default class View {
  constructor() {}

  #todolist = []
  #categories = []

  #items = document.getElementById('items')
  #btnAdd = document.getElementById('add-task')
  #btnCategory = document.getElementById('add-category')
  #btnSeach = document.getElementById('search-task')
  #empty = document.getElementById('empty-figure')
  #filter = document.getElementById('wrapper-filter')

  #months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  #days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  #filterTypes = [
    { name: 'All', param: 'all', active: true },
    { name: 'Active', param: 'active', active: false },
    { name: 'Completed', param: 'completed', active: false }
  ]

  // add new task
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
        this.#items.style.display = 'block'
        // calling methods
        this.todoUI(this.#todolist, this.#items)
        this.deleteTask()
        this.doneOrUndone()
        this.updateCount(this.#todolist)
        this.figure()
        this.filterUI()
      } else {
        this.#items.style.display = 'none'
      }
    })
  }

  // add new category
  addNewCategory() {
    this.#btnCategory.addEventListener('click', () => {
      const form = document.getElementById('category-editor')
      const { title } = form

      if (!title.value.trim()) return false

      this.#categories.push({
        title: title.value,
        id: Math.floor(Math.random() * 9999)
      })

      form.reset()

      if (this.#categories) {
        this.renderOptionCategories(this.#categories)
        this.categoryUI(this.#categories)
        this.filterByCategories()
      }
    })
  }

  searchTask() {
    this.#btnSeach.addEventListener('click', e => {
      const { task } = document.getElementById('search')
      const nodes = this.#items.querySelectorAll('li')
      const filterTypes = this.#filterTypes.find(filter => filter.active == true)

      if (!task.value.trim()) return this.todoUI(this.#todolist, this.#items)

      nodes.forEach(el => {
        el.style.display = 'none'

        if (filterTypes.param == 'all') {
          for (const key of this.#todolist) {
            const element = el.firstElementChild.lastElementChild.firstElementChild.textContent
            key.title.includes(task.value) && element == key.title ? el.style.display = 'flex' : ''
          }
        }

        if (filterTypes.param == 'active') {
          const inputs = this.#items.querySelectorAll('.view__list__task__checkbox__input')
  
          for (const key of this.#todolist) {
            inputs.forEach(input => {
              if (!input.checked) {
                const element = input.parentNode.lastElementChild.firstElementChild.textContent
                key.title.includes(task.value) && key.title == element ? input.parentNode.parentNode.style.display = 'flex' : ''
              }
            })
          }
        }

        if (filterTypes.param == 'completed') {
          const inputs = this.#items.querySelectorAll('.view__list__task__checkbox__input')
  
          for (const key of this.#todolist) {
            inputs.forEach(input => {
              if (input.checked) {
                const element = input.parentNode.lastElementChild.firstElementChild.textContent
                key.title.includes(task.value) && key.title == element ? input.parentNode.parentNode.style.display = 'flex' : ''
              }
            })
          }
        }
      })

      e.preventDefault()
    })
  }

  // create template html
  todoUI(todo, items) {
    const ui = todo.map(item => `
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

    items.innerHTML = ui
  }

  renderOptionCategories(category) {
    const select = document.getElementById('get-categories')
    const ui = `
      <select class="manager-content__form__field" id="get-categories" name="category">
        <option value="" selected disable>Category</option>
        ${category.map(item => `
          <option value="${item.title}">${item.title}</option>
        `)}
      </select>
    `

    select.innerHTML = ui
  }

  categoryUI(category) {
    const div = document.getElementById('category')
    const ui = category.map(item => `
      <a href="#!" class="view__categorie__category" data-id="${item.id}" data-category="${item.title}">
        ${item.title}
      </a>
    `).join('')

    div.innerHTML = ui
  }

  // check task as done or undone
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

  // delete an item from array
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

  // set current date
  setDate() {
    const date = new Date()
    const setDate = document.getElementById('title')

    setDate.innerHTML = `
      Today ${date.getDate()} <span id="date">${this.#days[date.getDay()]} - ${this.#months[date.getMonth()]}</span>
    `
  }

  // set total of tasks
  updateCount(todos) {
    return document.getElementById('count').innerHTML = `${todos.length} tasks`
  }

  // create template html
  filterUI() {
    !this.#todolist.length ? this.#filter.style.display = 'none' : this.#filter.style.display = 'block'

    const ui = this.#filterTypes.map(item => `
      <a
        href="#!" 
        class="view__filter__filtered ${item.active ? 'is--active' : ''}"
        data-param="${item.param}" 
        data-status="${item.active}"
      >
        ${item.name}
      </a>
    `).join('')

    this.#filter.innerHTML = ui
    this.activeFilter()
    this.filterByActive()
  }

  // set class active
  activeFilter() {
    const nodes = document.querySelectorAll('.view__filter__filtered')

    nodes.forEach(el => el.addEventListener('click', () => {
      const dataParam = el.getAttribute('data-param')
      const type = this.#filterTypes.find(i => i.param == dataParam)

      for (let key of this.#filterTypes) {
        key.active = false
        type.param == key.param ? key.active = true : null
      }

      this.filterUI()
    }))
  }

  //filter by categories
  filterByCategories() {
    const nodes = document.querySelectorAll('.view__categorie__category')

    nodes.forEach(el => el.addEventListener('click', () => {
      const dataCategory = el.getAttribute('data-category')
      const li = this.#items.querySelectorAll('li')

      li.forEach(el => el.getAttribute('data-category') === dataCategory ? el.style.display = 'flex' : el.style.display = 'none')
    }))
  }

  // filter by tasks
  filterByActive() {
    const nodes = document.querySelectorAll('.view__filter__filtered')

    nodes.forEach(el => el.addEventListener('click', () => {
      const dataParam = el.getAttribute('data-param')
      const li = this.#items.querySelectorAll('li')

      if (dataParam == 'all') {
        li.forEach(el => el.style.display = 'flex')
      }

      if (dataParam == 'active') {
        li.forEach(el => {
          const active = el.firstElementChild.lastElementChild.firstElementChild
          active.classList.contains('is--done') ? el.style.display = 'none' : el.style.display = 'flex'
        })
      }

      if (dataParam == 'completed') {
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