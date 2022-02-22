export default class View {
  constructor() { }

  #todolist = []
  #categories = []

  #ul = document.getElementById('todo')
  #ulCategories = document.getElementById('categories')
  #btnAddTask = document.getElementById('add-task')
  #btnAddCategory = document.getElementById('add-category')
  #empty = document.getElementById('empty-figure')
  #filter = document.getElementById('wrapper-filter')

  #months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  #days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  #filterTypes = [
    { name: 'All', param: 'all', active: true },
    { name: 'Active', param: 'active', active: false },
    { name: 'Completed', param: 'completed', active: false }
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
        this.todoUI(this.#todolist, this.#ul)
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

      this.#categories.push({
        title: title.value,
        id: Math.floor(Math.random() * 9999),
        active: false
      })

      form.reset()

      if (this.#categories) {
        this.selectUI(this.#categories)
        this.categoryUI(this.#categories)
        this.listCategoriesUI(this.#categories)
        this.deleteCategory()
      }
    })
  }

  /**
   * @description create template html of todolist
   * @param {Array<object>} todo
   * @param {HTMLElement} items
   * @returns {HTMLUListElement} create li of tasks
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
   * @description create buttons for categories
   * @param {Array<object>} category
   * @returns {HTMLAnchorElement} buttons
   */

  categoryUI(category) {
    document.getElementById('category').innerHTML = category.map(item => `
      <a 
        href="#!" 
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

  listCategoriesUI(category) {
    document.getElementById('categories').innerHTML = category.map(item => `
      <li>
        <div style="display: flex; justify-content: space-between">
          <a href="#!">
            ${item.title}
          </a>
          <a href="#!" class="delete-category" data-id="${item.id}">
            <i class="far fa-trash-alt"></i>
          </a>
        </div>
      </li>
    `).join('')
  }

  /**
   * @description render option of select categories
   * @param {Array<object>} category
   * @returns {HTMLOptionElement} render option when i created categories
   */

  selectUI(category) {
    document.getElementById('get-categories').innerHTML = `
      <select class="manager-content__form__field" id="get-categories" name="category">
        <option selected disable>Category</option>
        ${category.map(item => `<option value="${item.title}">${item.title}</option>`)}
      </select>
    `
  }

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

  doneOrUndone() {
    const nodes = this.#ul.querySelectorAll('.view__list__task__checkbox__input')

    nodes.forEach(element => 
      element.addEventListener('click', () => {
        const task = this.#todolist.find(task => task.id == element.getAttribute('data-id'))

        if (element.checked) {
          task.done = true
          element.parentNode.lastElementChild.firstElementChild.classList.add('is--done')
        } else {
          task.done = false
          element.parentNode.lastElementChild.firstElementChild.classList.remove('is--done')
        }
      })
    )
  }

  deleteTask() {
    const nodes = this.#ul.querySelectorAll('.view__list__task__delete--delete')

    nodes.forEach(element => 
      element.addEventListener('click', () => {
        this.#todolist.splice(this.#todolist.indexOf(task => task.id == element.getAttribute('data-id')), 1)
        this.updateCount(this.#todolist)
        this.filterUI()
        this.figure()
        element.parentNode.parentNode.remove()
      })
    )
  }

  deleteCategory() {
    const nodes = document.querySelectorAll('.delete-category')

    nodes.forEach(element => 
      element.addEventListener('click', () => {
        console.log(element)
        const teste = this.#categories.indexOf(category => category.id == element.getAttribute('data-id'), 1)
        
        console.log(teste)

        // this.#categories.splice(), 1)
        this.listCategoriesUI(this.#categories)
        this.categoryUI(this.#categories)
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
  
  activeFilter() {
    const nodes = document.querySelectorAll(".view__filter__filtered")

    nodes.forEach(element => 
      element.addEventListener("click", () => {
        const filter = this.#filterTypes.find(filter => filter.param === element.getAttribute("data-param"))

        for (let key of this.#filterTypes) {
          filter.param.includes(key.param) ? key.active = true : key.active = false
        }

        this.filterUI()
      })
    )
  }

  filterByCategories() {
    const nodes = this.#ulCategories.querySelectorAll('.view__categorie__category')

    nodes.forEach(element => 
      element.addEventListener('click', () => {
        const inputSearch = document.getElementById('search').value
        const currentFilterType = this.#filterTypes.find(filter => filter.active === true)
        const category = this.#categories.find(category => category.title === element.getAttribute('data-category'))

        for (const key of this.#categories) {
          category.title.includes(key.title) ? key.active = true : key.active = false
        }

        this.categoryUI(this.#categories)
        this.filters(inputSearch, currentFilterType.param, category.title)
      })
    )
  }

  filterByStatus() {
    const nodes = document.querySelectorAll('.view__filter__filtered')

    nodes.forEach(element => 
      element.addEventListener('click', () => {
        const currentFilterName = element.getAttribute('data-param')
        const inputSearch = document.getElementById('search').value
        const category = this.#categories.find(item => item.active === true)

        this.filters(inputSearch, currentFilterName, category)
      })
    )
  }

  searchTask() {
    const input = document.getElementById('search')

    input.addEventListener('input', e => {
      const value = e.target.value
      const filterStatus = this.#filterTypes.find(item => item.active === true)
      const category = this.#categories.find(item => item.active === true)
      const hasCategory = category ?  category.title : false
      this.filters(value, filterStatus.param, hasCategory)
    })
  }

  /**
   * @description considering search bar when filter tasks
   * @param {HTMLLIElement} li
   * @param {String} value from seacrch bar
   * @param {String} param from filterStatus
   * @param {String} category from category
   */

  filters(value, param, category) {
    if (param === 'all') {
      for (const key of this.#todolist) {
        if (category) {
          if (key.title.includes(value) && key.category === category) {
            console.log('parametro all')
            console.log('tem categoria')
            console.log(key.title)
          }
        } else {
          if (key.title.includes(value) && !key.category) {
            console.log('parametro all')
            console.log('não tem categoria')
            console.log(key.title)
          }
        }
      }
    }

    if (param === 'active') {
      for (const key of this.#todolist) {
        if (category) {
          if (key.title.includes(value) && key.category === category && !key.done) {
            console.log('parametro active')
            console.log('tem categoria')
            console.log(key.title)
          }
        } else {
          if (key.title.includes(value) && !key.category && !key.done) {
            console.log('parametro active')
            console.log('não tem categoria')
            console.log(key.title)
          }
        }
      }
    }

    if (param === 'completed') {
      for (const key of this.#todolist) {
        if (category) {
          if (key.title.includes(value) && key.category === category && key.done) {
            console.log('parametro completed')
            console.log('tem categoria')
            console.log(key.title)
          }
        } else {
          if (key.title.includes(value) && !key.category && key.done) {
            console.log('parametro completed')
            console.log('não tem categoria')
            console.log(key.title)
          }
        }
      }
    }
  }

  /* filters(li, value, param, category) {
    li.forEach(el => {
      const textNode = el.firstElementChild.lastElementChild.firstElementChild.textContent
      const titleNode = el.firstElementChild.lastElementChild.firstElementChild
      const isDone = titleNode.classList.contains('is--done')

      this.#todolist.forEach(todo => {
        if (!todo.title.includes(value) && textNode === todo.title) {
          console.log(todo)
        }

        /* if (param === 'active') {
          todo.title.includes(value) && textNode === todo.title && isDone ? el.classList.add('hide') : el.classList.remove('hide')
        }

        if (param === 'completed') {
          todo.title.includes(value) && textNode === todo.title && !isDone ? el.classList.add('hide') : el.classList.remove('hide')
        } */

        /* if (todo.title.includes(value) && textNode === todo.title) {
          if (category) {
            category.title === el.getAttribute('data-category') ? el.style.display = 'flex' : el.style.display = 'none'
          } else {
            el.style.display = 'flex'
          }
          el.classList.remove('hide')
        } 

        if (todo.title.includes(value) && textNode === todo.title && isDone && param === 'active') {
          el.style.display = 'none'
        }

        if (todo.title.includes(value) && textNode === todo.title && !isDone && param === 'completed') {
          el.style.display = 'none'
        }
      })
    })
  } */

  figure() {
    this.#todolist.length < 1 ? this.#empty.style.display = 'block' : this.#empty.style.display = 'none'
  }

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
      this.#btnAddCategory.style.display = 'none'
      this.#btnAddTask.style.display = 'block'
      this.#categories.length ? select.style.display = 'block' : select.style.display = 'none'
      this.#empty.style.display = 'none'
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
    this.searchTask()
  }
}