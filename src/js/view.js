export default class View {
  constructor() { }

  #todolist = []
  #categories = []
  
  #btnAddTask = document.getElementById('add-task')
  #btnAddCategory = document.getElementById('add-category')
  #empty = document.getElementById('empty-figure')
  #filter = document.getElementById('wrapper-filter')

  #months = [
    'Jan', 
    'Feb', 
    'Mar', 
    'Apr', 
    'May', 
    'Jun', 
    'Jul', 
    'Aug', 
    'Sep', 
    'Oct', 
    'Nov', 
    'Dec'
  ]

  #days = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ]

  #filterTypes = [
    { 
      name: 'All', 
      param: 'all',
      active: true
    },
    { 
      name: 'Active', 
      param: 'active',
      active: false 
    },
    { 
      name: 'Completed', 
      param: 'completed', 
      active: false
    }
  ]

  addNewTask() {
    this.#btnAddTask.addEventListener('click', () => {
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
        this.todoUI(this.#todolist)
        this.deleteTask()
        this.doneOrUndone()
        this.updateCount(this.#todolist)
        this.figure()
        this.filterUI()
      }
    })
  }

  addNewCategory() {
    this.#btnAddCategory.addEventListener('click', () => {
      const form = document.getElementById('category-editor')
      const { title } = form

      if (!title.value.trim()) return false

      if (this.#categories.length) {
        for (const key of this.#categories) {
          if (key.title.includes(title.value)) return false
        }
      }

      this.#categories.push({
        title: title.value,
        id: Math.floor(Math.random() * 9999),
        active: false
      })

      form.reset()

      if (this.#categories) {
        this.optionCategoryUI(this.#categories)
        this.categoryUI(this.#categories)
        this.listCategoriesUI(this.#categories)
        this.deleteCategory()
        this.updateCountCategories(this.#categories)
      }
    })
  }

  todoUI(todo) {
    document.getElementById('todos').innerHTML = todo.map(task => `
      <li
        class="view__list__task" 
        id="task-${task.id}" 
        data-id="${task.id}" 
        ${task.category ? `data-category="${task.category}"` : ''}
      >
        <div class="view__list__task__checkbox">
          <input 
            type="checkbox" 
            class="view__list__task__checkbox__input" 
            data-id="${task.id}" ${task.done ? 'checked' : ''}
          />
          <div class="view__list__task__checkbox__body">
            <h4 class="view__list__task__checkbox__body__title title-list ${task.done ? 'is--done' : ''}">
              ${task.title}
            </h4>
            <p class="view__list__task__checkbox__body__description">
              ${task.content}
            </p>
            ${task.category ? `<small>Category: ${task.category}</small>` : ''}
          </div>
        </div>
        <div class="view__list__task__delete">
          <a href="#!" class="view__list__task__delete--delete" data-id="${task.id}">
            <i class="far fa-trash-alt"></i>
          </a>
        </div>
      </li>
    `).join('')
  }

  categoryUI(category) {
    document.getElementById('category').innerHTML = `
      ${category.map(item => `
        <a href="#!" 
          class="view__categorie__category ${item.active ? 'is--active' : ''}" 
          data-id="${item.id}" 
          data-category="${item.title}" 
          data-active="${item.active}"
        >
          ${item.title}
        </a>
      `).join('')}
    `

    this.activeFilterCategory()
  }

  activeFilterCategory() {
    const nodes = document.querySelectorAll('.view__categorie__category')

    nodes.forEach(element => 
      element.addEventListener("click", () => {
        const currentCategory = this.#categories.find(category => category.title === element.getAttribute('data-category'))

        for (const key of this.#categories) {
          event.detail === 2 ? key.active = false : currentCategory.title === key.title ? key.active = true : key.active = false
        }

        this.categoryUI(this.#categories)
        this.filter()
      })
    )
  }

  listCategoriesUI(category) {
    document.getElementById('categories').innerHTML = `
      <li class="categories__count">
        <span id="count-categories">0 categories</span>
      </li>
      ${category.map(item => `
        <li class="categories__list">
          <div class="categories__list__body">
            <a href="#!">
              ${item.title}
            </a>
            <a href="#!" class="categories__list__body__delete-category is--red" data-id="${item.id}">
              <i class="far fa-trash-alt"></i>
            </a>
          </div>
        </li>
      `).join('')}
    `
  }

  optionCategoryUI(category) {
    document.getElementById('get-categories').innerHTML = `
      <option value="" selected>Select category ...</option>
      ${category.map(category => `<option value="${category.title}">${category.title}</option>`)}
    `
  }

  filterUI() {
    !this.#todolist.length ? this.#filter.classList.add('is--hide') : this.#filter.classList.remove('is--hide')

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

    this.activeFilterType()
  }

  activeFilterType() {
    const nodes = document.querySelectorAll(".view__filter__filtered")

    nodes.forEach(element => 
      element.addEventListener("click", () => {
        const currentFilterType = this.#filterTypes.find(filter => filter.param === element.getAttribute("data-param"))

        for (let key of this.#filterTypes) {
          currentFilterType.param.includes(key.param) ? key.active = true : key.active = false
        }

        this.filterUI()
        this.filter()
      })
    )
  }

  doneOrUndone() {
    const nodes = document.querySelectorAll('.view__list__task__checkbox__input')

    nodes.forEach(element => 
      element.addEventListener('click', () => {
        const task = this.#todolist.find(task => task.id == element.getAttribute('data-id'))
        const text = element.parentNode.lastElementChild.firstElementChild

        if (element.checked) {
          task.done = true
          text.classList.add('is--done')
          this.filter()
        } else {
          task.done = false
          text.classList.remove('is--done')
          this.filter()
        }
      })
    )
  }

  deleteTask() {
    const nodes = document.querySelectorAll('.view__list__task__delete--delete')

    nodes.forEach(element => 
      element.addEventListener('click', () => {
        this.#todolist.splice(this.#todolist.indexOf(task => task.id === element.getAttribute('data-id')), 1)
        this.updateCount(this.#todolist)
        this.filterUI()
        this.figure()
        element.parentNode.parentNode.remove()
      })
    )
  }

  deleteCategory() {
    const nodes = document.querySelectorAll('.categories__list__body__delete-category')

    nodes.forEach(element => 
      element.addEventListener('click', () => {
        this.#categories.splice(this.#categories.indexOf(category => category.id === element.getAttribute('data-id')), 1)
        this.categoryUI(this.#categories)
        this.updateCountCategories(this.#categories)

        for (const key of this.#todolist) {
          if (key.category) {
            key.category = false
            this.todoUI(this.#todolist)
          }
        }

        element.parentNode.parentNode.remove()
      })
    )
  }

  setDate() {
    const date = new Date()
    const setDate = document.getElementById("title")

    setDate.innerHTML = `
      Today ${date.getDate()} <span id="date">${this.#days[date.getDay()]} - ${this.#months[date.getMonth()]}</span>
    `
  }

  updateCount(todos) {
    document.getElementById("count").innerHTML = `${todos.length} tasks`
  }

  updateCountCategories(categories) {
    document.getElementById("count-categories").innerHTML = `${categories.length} categories`
  }

  filter() {
    const currentCategory = this.#categories.find(category => category.active === true)
    const currentFilterType = this.#filterTypes.find(filterType => filterType.active === true)
    const input = document.querySelectorAll('.view__list__task__checkbox__input')
    const inputSearch = document.getElementById('search')
    
    inputSearch.addEventListener('keyup', e => {
      const value = e.target.value.toLowerCase()
      this.checkFilters(currentCategory, currentFilterType.param, input, value)
    })

    this.checkFilters(currentCategory, currentFilterType.param, input)
  }

  checkFilters(category, filterType, input, searchValue) {
    const nodes = document.querySelectorAll('.view__list__task')
    const inputSearch = document.getElementById('search')

    if (category) {
      if (filterType === 'all') {
        nodes.forEach(element => {
          const dataCategory = element.getAttribute('data-category')
          dataCategory !== category.title ? element.classList.add('is--hide') : element.classList.remove('is--hide')
        })
      }

      if (filterType === 'active') {
        input.forEach(input => {
          const li = input.parentNode.parentNode
          const dataCategory = input.parentNode.parentNode.getAttribute('data-category')
          dataCategory !== category.title || input.checked ? li.classList.add('is--hide') : li.classList.remove('is--hide')
        })
      }

      if (filterType === 'completed') {
        input.forEach(input => {
          const li = input.parentNode.parentNode
          const dataCategory = input.parentNode.parentNode.getAttribute('data-category')
          dataCategory !== category.title || !input.checked ? li.classList.add('is--hide') : li.classList.remove('is--hide')
        })
      }
    } else {
      if (filterType === 'all')
        nodes.forEach(element => {
          const title = element.firstElementChild.lastElementChild.firstElementChild.textContent
          
          if (searchValue) {
            return !title.includes(searchValue) ? element.classList.add('is--hide') : element.classList.remove('is--hide')
          }

          if (inputSearch.value) {
            return !title.includes(inputSearch.value) ? element.classList.add('is--hide') : element.classList.remove('is--hide')
          }

          element.classList.remove('is--hide')
        })

      if (filterType === 'active') {
        input.forEach(input => {
          const title = input.parentElement
          const li = input.parentElement.parentNode.lastElementChild.firstElementChild.textContent

          input.checked ? li.classList.add('is--hide') : li.classList.remove('is--hide')
        })
      }

      if (filterType === 'completed') {
        input.forEach(input => {
          const li = input.parentNode.parentNode
          !input.checked ? li.classList.add('is--hide') : li.classList.remove('is--hide')
        })
      }
    }
  }

  figure() {
    !this.#todolist.length ? this.#empty.classList.remove('is--hide') : this.#empty.classList.add('is--hide')
  }

  toggleManagerContent() {
    const btnOpen = document.getElementById('open')
    const btnClose = document.getElementById('close')
    const managerContent = document.getElementById('manager-content')
    const openCategory = document.getElementById('open-category')
    const formTask = document.getElementById('task-editor')
    const formCategory = document.getElementById('category-editor')
    const select = document.getElementById('get-categories')
    const listCategories = document.getElementById('categories')

    btnOpen.addEventListener('click', () => {
      managerContent.style.display = 'block'
      btnOpen.style.opacity = '0'
      openCategory.style.opacity = '0'
      formCategory.style.display = 'none'
      formTask.style.display = 'flex'
      this.#btnAddCategory.style.display = 'none'
      this.#btnAddTask.style.display = 'block'
      this.#categories.length ? select.style.display = 'block' : select.style.display = 'none'
      this.#empty.style.display = 'none'
      listCategories.style.display = 'none'
    })

    openCategory.addEventListener('click', () => {
      managerContent.style.display = 'block'
      btnOpen.style.opacity = '0'
      openCategory.style.opacity = '0'
      formTask.style.display = 'none'
      formCategory.style.display = 'flex'
      this.#btnAddTask.style.display = 'none'
      this.#btnAddCategory.style.display = 'block'
      this.#empty.style.display = 'none'
      listCategories.style.display = 'block'
    })

    btnClose.addEventListener('click', () => {
      managerContent.style.display = 'none'
      btnOpen.style.opacity = '1'
      openCategory.style.opacity = '1'
      this.#empty.style.display = 'block'
    })
  }

  _init() {
    this.addNewTask()
    this.addNewCategory()
    this.setDate()
    this.toggleManagerContent()
    this.figure()
    this.filter()
  }
}