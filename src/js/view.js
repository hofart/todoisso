export default class View {
  constructor({ filterTypes, months, days }) {
    this.filterTypes = filterTypes
    this.months = months,
    this.days = days
   }

  #todolist = [];
  #categories = [];
  #btnAddTask = document.getElementById('add-task');
  #btnAddCategory = document.getElementById('add-category');
  #empty = document.getElementById('empty-figure');
  #filter = document.getElementById('wrapper-filter');

  addNewTask() {
    this.#btnAddTask.addEventListener('click', () => {
      const { title, content, category } = document.getElementById('task-editor');
      const currentFilterType = this.filterTypes.find(filter => filter.active === true);

      this.checkCurrentFilterTypes(currentFilterType);

      this.#todolist.push({
        title: title.value,
        content: content.value,
        id: parseInt(Math.random() * 9999),
        done: false,
        category: category.value ? category.value : false
      });

      title.value = '';
      content.value = '';
      title.value = '';

      this.todoUI();
      this.deleteTask();
      this.doneOrUndone();
      this.updateCount(this.#todolist);
      this.figure();
      this.filterUI();
      this.#btnAddTask.setAttribute('disabled', 'disabled');
    })
  }

  hasTitleValue(title) {
    title.addEventListener('keyup', (e) => {
      e.target.value ? this.#btnAddTask.removeAttribute('disabled') : this.#btnAddTask.setAttribute('disabled', 'disabled');
    })
  }

  addNewCategory() {
    this.#btnAddCategory.addEventListener('click', () => {
      const { title } = document.getElementById('category-editor');

      if (!title.value.trim()) return false;

      if (this.#categories.length) {
        checkCurrentCategories();
      }

      this.#categories.push({
        title: title.value,
        id: Math.floor(Math.random() * 9999),
        active: false
      })

      this.optionCategoryUI(this.#categories);
      this.categoryUI();
      this.listCategoriesUI(this.#categories);
      this.deleteCategory();
      this.updateCountCategories(this.#categories);

      title.value = '';

      return true;
    })
  }

  todoUI() {
    document.getElementById('todos').innerHTML = this.#todolist.map(task => `
      <li class="view__list__task" id="task-${task.id}" data-id="${task.id}" ${task.category ? `data-category="${task.category}"` : ''}>
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
    `).join('');
  }

  categoryUI() {
    document.getElementById('category').innerHTML = `
      ${this.#categories.map(category => `
        <a href="#!" 
          class="view__categorie__category ${category.active ? 'is--active' : ''}" 
          data-id="${category.id}" 
          data-category="${category.title}" 
          data-active="${category.active}"
        >
          ${category.title}
        </a>
      `).join('')}
    `;

    this.activeFilterCategory();
  }

  activeFilterCategory() {
    const nodes = document.querySelectorAll('.view__categorie__category');

    nodes.forEach(element => 
      element.addEventListener("click", () => {
        const currentCategory = this.#categories.find(category => category.title === element.getAttribute('data-category'));

        for (const key of this.#categories) {
          event.detail === 2 ? key.active = false : currentCategory.title === key.title ? key.active = true : key.active = false;
        }

        this.categoryUI();
        this.filter();
      })
    );
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

    this.#filter.innerHTML = this.filterTypes.map(item => `
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
        const currentFilterType = this.filterTypes.find(filter => filter.param === element.getAttribute("data-param"))

        for (let key of this.filterTypes) {
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
        this.categoryUI()
        this.updateCountCategories(this.#categories)

        for (const key of this.#todolist) {
          if (key.category) {
            key.category = false
            this.todoUI()
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
      Today ${date.getDate()} <span id="date">${this.days[date.getDay()]} - ${this.months[date.getMonth()]}</span>
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
    const currentFilterType = this.filterTypes.find(filterType => filterType.active === true)
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
          const title = element.firstElementChild.lastElementChild.firstElementChild.textContent

          if (searchValue) {
            if (!title.includes(searchValue) && dataCategory === category.title || dataCategory !== category.title) {
              return element.classList.add('is--hide')
            } else {
              return element.classList.remove('is--hide')
            }
          }

          if (inputSearch.value) {
            if (!title.includes(inputSearch.value) && dataCategory === category.title || dataCategory !== category.title) {
              return element.classList.add('is--hide')
            } else {
              return element.classList.remove('is--hide')
            }
          }

          dataCategory !== category.title ? element.classList.add('is--hide') : element.classList.remove('is--hide')
        })
      }

      if (filterType === 'active') {
        input.forEach(input => {
          const li = input.parentElement.parentNode
          const dataCategory = input.parentElement.parentNode.getAttribute('data-category')
          const title = input.parentNode.lastElementChild.firstElementChild.textContent

          if (inputSearch.value && !input.checked) {
            if (!title.includes(inputSearch.value) && dataCategory === category.title || dataCategory !== category.title) {
              return li.classList.add('is--hide')
            } else {
              return li.classList.remove('is--hide')
            }
          }

          if (searchValue && !input.checked) {
            if (!title.includes(searchValue) && dataCategory === category.title || dataCategory !== category.title) {
              return li.classList.add('is--hide')
            } else {
              return li.classList.remove('is--hide')
            }
          }

          dataCategory !== category.title || input.checked ? li.classList.add('is--hide') : li.classList.remove('is--hide')
        })
      }

      if (filterType === 'completed') {
        input.forEach(input => {
          const li = input.parentElement.parentNode
          const dataCategory = input.parentElement.parentNode.getAttribute('data-category')
          const title = input.parentNode.lastElementChild.firstElementChild.textContent

          if (inputSearch.value && input.checked) {
            if (!title.includes(inputSearch.value) && dataCategory === category.title || dataCategory !== category.title) {
              return li.classList.add('is--hide')
            } else {
              return li.classList.remove('is--hide')
            }
          }

          if (searchValue && input.checked) {
            if (!title.includes(searchValue) && dataCategory === category.title || dataCategory !== category.title) {
              return li.classList.add('is--hide')
            } else {
              return li.classList.remove('is--hide')
            }
          }


          dataCategory !== category.title || !input.checked ? li.classList.add('is--hide') : li.classList.remove('is--hide')
        })
      }
    } else {
      if (filterType === 'all') {
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
      }

      if (filterType === 'active') {
        input.forEach(input => {
          const li = input.parentElement.parentNode
          const title = input.parentNode.lastElementChild.firstElementChild.textContent

          if (searchValue && !input.checked ) {
            return !title.includes(searchValue) ? li.classList.add('is--hide') : li.classList.remove('is--hide')
          }

          if (inputSearch.value && !input.checked) {
            return !title.includes(inputSearch.value) ? li.classList.add('is--hide') : li.classList.remove('is--hide')
          }

          input.checked ? li.classList.add('is--hide') : li.classList.remove('is--hide')
        })
      }

      if (filterType === 'completed') {
        input.forEach(input => {
          const li = input.parentElement.parentNode
          const title = input.parentNode.lastElementChild.firstElementChild.textContent
          
          if (searchValue && input.checked ) {
            return !title.includes(searchValue) ? li.classList.add('is--hide') : li.classList.remove('is--hide')
          }

          if (inputSearch.value && input.checked) {
            return !title.includes(inputSearch.value) ? li.classList.add('is--hide') : li.classList.remove('is--hide')
          }

          !input.checked ? li.classList.add('is--hide') : li.classList.remove('is--hide')
        })
      }
    }
  }

  checkCurrentFilterTypes(currentFilterType) {
    if (currentFilterType.param !== 'all') {
      for (const key of this.filterTypes) key.active = false;
      for (const key of this.#categories) key.active = false;
      this.filterTypes[0].active = true;
    }
  }

  checkCurrentCategories() {
    for (const key of this.#categories) {
      if (key.title.includes(title.value)) {
        return false;
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
    const { title } = document.getElementById('task-editor');

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
      this.hasTitleValue(title)
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